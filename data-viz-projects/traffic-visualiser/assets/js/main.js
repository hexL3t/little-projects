// Wrapped in an async IIFE so we can `await loadData()` before wiring up
// the rest of the app — everything below only runs once real data (or the
// synthetic fallback) is actually ready.
(async () => {
    // ---------------------------------------------------------------
    // 1. DATA LAYER
    // Loads assets/data/unsw-nb15-sample.csv via PapaParse (see loadData()
    // below) and falls back to generateSyntheticEvents() if that file is
    // missing or fails to parse.
    // ---------------------------------------------------------------

    // Full UNSW-NB15 category set. Order here also drives the order chips
    // and histogram rows render in the sidebar.
    const ATTACK_CATS = ["Normal", "Reconnaissance", "Fuzzers", "Analysis", "Exploits", "DoS", "Generic", "Backdoor", "Shellcode", "Worms"];

    // Maps each category to a severity bucket, which in turn drives color
    // (see colorFor()) and which header stat (Normal/Suspicious/Attack) it
    // increments.
    const SEVERITY = {
        "Normal": "benign",
        "Reconnaissance": "warn", "Analysis": "warn", "Generic": "warn",
        "Fuzzers": "alert", "Exploits": "alert", "DoS": "alert", "Backdoor": "alert",
        "Shellcode": "alert", "Worms": "alert"
    };

    // The training-set/testing-set CSVs spell some categories differently
    // ("Backdoors" instead of "Backdoor"), and rows sometimes carry stray
    // whitespace. Normalize to the canonical names above.
    function normalizeCat (raw) {
        const cleaned = (raw || '').trim();
        if (!cleaned) return 'Normal'; // blank attack_cat means benign traffic in the real dataset
        if (/^backdoors?$/i.test(cleaned)) return 'Backdoor';
        // Case-insensitive match against the canonical list; if nothing
        // matches, fall through and return the raw cleaned value as-is
        // (better to show an unexpected label than silently drop the event).
        const match = ATTACK_CATS.find(c => c.toLowerCase() === cleaned.toLowerCase());
        return match || cleaned;
    }

    const PROTOCOLS = ["tcp", "udp", "icmp"];
    const SERVICES = ["http", "dns", "ftp", "smtp", "ssh", "-"];

    // Generates a plausible-looking private IP for synthetic traffic.
    function randIp () {
        return `10.${1 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    // Fallback data generator, used when the real CSV can't be loaded.
    // Produces the same event shape mapRows() produces from real data, so
    // the rest of the app never needs to know which source it came from.
    function generateSyntheticEvents (n = 260) {
        const nodeCount = 14;
        // node 0 is always "gateway" — a fixed central hub the graph layout
        // anchors on; the rest are random pseudo-hosts around it.
        const nodes = Array.from({ length: nodeCount }, (_, i) => ({
            id: i === 0 ? "gateway" : randIp(),
        }));
        const events = [];
        let t = 0;
        for (let i = 0; i < n; i++) {
            // Random gap between events, so the replay doesn't tick at a
            // perfectly uniform rate.
            t += Math.random() * 0.7 + 0.15;
            const weighted = Math.random();
            // ~60% Normal traffic, remainder split across the 9 attack
            // categories — roughly mirrors the real dataset's class imbalance.
            const cat = weighted < 0.60 ? "Normal" : ATTACK_CATS[1 + Math.floor(Math.random() * (ATTACK_CATS.length - 1))];
            const src = nodes[Math.floor(Math.random() * nodeCount)].id;
            let dst = nodes[Math.floor(Math.random() * nodeCount)].id;
            if (dst === src) dst = nodes[(nodeCount - 1)].id; // avoid a host talking to itself
            events.push({
                t: Number(t.toFixed(2)),
                src, dst,
                proto: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
                service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
                attack_cat: cat,
                label: cat === "Normal" ? 0 : 1,
                sbytes: Math.floor(Math.random() * 4000),
                dbytes: Math.floor(Math.random() * 4000),
            });
        }
        return { nodes, events };
    }

    // Path to the real dataset, dropped in assets/data/ alongside this page.
    // Point this at whichever UNSW-NB15 file you downloaded.
    const CSV_PATH = 'assets/data/unsw-nb15-sample.csv';

    // Cap how many rows get rendered at once. The full dataset is 175k+ rows —
    // way more than a graph should try to animate. Raise/lower to taste.
    const MAX_EVENTS = 400;

    // A stable pool of pseudo-hosts to assign traffic to when the CSV has no
    // real srcip/dstip columns (true of the training-set/testing-set files,
    // which strip IPs for the ML task). Same host list every reload, so the
    // graph layout stays consistent between sessions.
    const PSEUDO_HOSTS = Array.from({ length: 13 }, (_, i) => `10.${1 + (i % 3)}.${(i * 37) % 255}.${(i * 53) % 255}`);

    // Deterministic hash → pool index, so the same row index always maps to
    // the same pseudo-host on every reload (rather than a fresh random host
    // each time, which would make the graph shape jump around pointlessly).
    function pseudoHost (seedString) {
        let hash = 0;
        for (let i = 0; i < seedString.length; i++) hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
        return PSEUDO_HOSTS[hash % PSEUDO_HOSTS.length];
    }

    // Converts parsed CSV rows (from PapaParse, header:true) into the same
    // event shape generateSyntheticEvents() produces.
    function mapRows (rows) {
        const nodesSeen = new Set(['gateway']);
        const events = [];
        let t = 0;

        // Sample evenly across the file rather than just taking the first N rows,
        // so you see traffic from the whole capture, not just its opening seconds.
        const step = Math.max(1, Math.floor(rows.length / MAX_EVENTS));

        for (let i = 0; i < rows.length; i += step) {
            const r = rows[i];
            if (!r || (!r.proto && !r.attack_cat)) continue; // skip blank/malformed rows

            // Original UNSW-NB15_1–4.csv files have real srcip/dstip; the
            // training-set/testing-set files don't. Fall back to a stable
            // pseudo-host in that case so the graph still has structure.
            const hasIps = r.srcip && r.dstip;
            const src = hasIps ? r.srcip : pseudoHost(`${i}-src`);
            const dst = hasIps ? r.dstip : pseudoHost(`${i}-dst`);

            // training-set/testing-set CSVs leave attack_cat blank for normal traffic
            const attack_cat = normalizeCat(r.attack_cat);

            // Real capture timestamps aren't in the ML-ready files, so space events
            // out using each row's own duration (falls back to a small fixed gap).
            t += (Number(r.dur) > 0 ? Number(r.dur) : 0.3);

            nodesSeen.add(src); nodesSeen.add(dst);
            events.push({
                t: Number(t.toFixed(2)),
                src, dst,
                proto: (r.proto || 'tcp').toLowerCase(),
                service: r.service || '-',
                attack_cat,
                // Some dataset variants use 0/1 ints for label, others leave it
                // blank — derive it from attack_cat if the column is missing/odd.
                label: Number(r.label) || (attack_cat === 'Normal' ? 0 : 1),
                sbytes: Number(r.sbytes) || 0,
                dbytes: Number(r.dbytes) || 0,
            });
            if (events.length >= MAX_EVENTS) break;
        }

        const nodes = [...nodesSeen].map(id => ({ id }));
        return { nodes, events };
    }

    // Attempts to load the real CSV; resolves with synthetic data instead if
    // the file is missing, empty, or fails to parse for any reason. Always
    // resolves — never rejects — so the caller doesn't need a try/catch.
    function loadData () {
        return new Promise((resolve) => {
            Papa.parse(CSV_PATH, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (res) => {
                    if (!res.data || !res.data.length) {
                        console.warn('CSV empty or not found, falling back to synthetic data');
                        resolve(generateSyntheticEvents(260));
                        return;
                    }
                    resolve(mapRows(res.data));
                },
                error: (err) => {
                    console.warn('Could not load CSV, falling back to synthetic data:', err);
                    resolve(generateSyntheticEvents(260));
                }
            });
        });
    }

    // Everything below depends on nodes/events actually being loaded first.
    const { nodes, events } = await loadData();
    const totalTime = events[events.length - 1].t; // replay duration = last event's timestamp

    // ---------------------------------------------------------------
    // 2. STATE
    // Single object holding everything that changes during playback.
    // Kept as one object (rather than scattered variables) so it's easy to
    // reason about what "the current state of the replay" actually is.
    // ---------------------------------------------------------------
    const state = {
        playing: true,
        speed: 1,          // playback speed multiplier, set via the speed <select>
        clock: 0,           // current position in the replay timeline (seconds)
        activeCats: new Set(ATTACK_CATS),   // categories currently shown (chip filters)
        activeProtos: new Set(PROTOCOLS),   // protocols currently shown (chip filters)
        pulses: [],          // in-flight animated dots currently travelling between nodes
        counts: { benign: 0, warn: 0, alert: 0 },              // header stat totals
        catCounts: Object.fromEntries(ATTACK_CATS.map(c => [c, 0])),   // all-time per-category totals (shown as numbers)
        recentCounts: Object.fromEntries(ATTACK_CATS.map(c => [c, 0])), // decays over time, drives bar widths
        talkerCounts: {},    // per-host event counts, for the Top Talkers list
        nextEventIdx: 0,     // index of the next event still to be emitted
        focusNode: null,     // host id currently isolated by clicking a node, or null
    };

    // ---------------------------------------------------------------
    // 3. LAYOUT
    // Canvas sizing and node positions. Nodes are arranged in a ring around
    // a central "gateway" node; positions are recalculated on every resize.
    // ---------------------------------------------------------------
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvas-wrap');
    let W, H, DPR; // current canvas CSS size (W,H) and device pixel ratio

    // Resizes the canvas's backing bitmap to match its displayed size at the
    // current device pixel ratio (so it stays crisp on high-DPI screens),
    // then recalculates where every node should sit.
    function resize () {
        DPR = window.devicePixelRatio || 1;
        W = wrap.clientWidth;
        H = wrap.clientHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        // Scale the drawing context so all subsequent draw calls can keep
        // using CSS-pixel coordinates rather than device pixels.
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        layoutNodes();
    }

    // Places "gateway" dead center, and arranges every other node evenly
    // around it in a ring. Radius is bounded by whichever of width/height
    // is smaller, so the ring always fits regardless of aspect ratio.
    function layoutNodes () {
        const cx = W / 2, cy = H / 2;
        const r = Math.min(W, H) * 0.34;
        nodes.forEach((n, i) => {
            if (n.id === "gateway") { n.x = cx; n.y = cy; }
            else {
                const angle = (i / (nodes.length - 1)) * Math.PI * 2 - Math.PI / 2;
                n.x = cx + Math.cos(angle) * r;
                n.y = cy + Math.sin(angle) * r;
            }
        });
    }

    // Watching the container itself (rather than only window resize) catches
    // every reason its box can change size — grid track recalculation, a
    // webfont finishing load and reflowing text, or this page being resized
    // inside a container/iframe on the portfolio site without the browser
    // window itself firing a resize event.
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(wrap);

    // Quick id → node lookup, used constantly when mapping events to
    // on-screen positions.
    const nodeById = {};
    nodes.forEach(n => nodeById[n.id] = n);

    // ---------------------------------------------------------------
    // 4. FILTER UI
    // Builds the category and protocol filter chips in the sidebar and
    // wires up their click-to-toggle behavior against state.activeCats /
    // state.activeProtos.
    // ---------------------------------------------------------------
    const catFiltersEl = document.getElementById('cat-filters');
    const catChipEls = {}; // cat -> chip element, so updateHistogram() can update the count badge on each
    ATTACK_CATS.forEach(cat => {
        const chip = document.createElement('div');
        chip.className = 'chip active'; // all categories start visible
        chip.dataset.cat = cat; // used by CSS to color the dot per category
        chip.innerHTML = `<span class="dot"></span>${cat}<span class="count">0</span>`;
        chip.addEventListener('click', () => {
            if (state.activeCats.has(cat)) { state.activeCats.delete(cat); chip.classList.remove('active'); }
            else { state.activeCats.add(cat); chip.classList.add('active'); }
        });
        catFiltersEl.appendChild(chip);
        catChipEls[cat] = chip;
    });

    const protoFiltersEl = document.getElementById('proto-filters');
    PROTOCOLS.forEach(p => {
        const chip = document.createElement('div');
        chip.className = 'proto-chip active';
        chip.textContent = p;
        chip.addEventListener('click', () => {
            if (state.activeProtos.has(p)) { state.activeProtos.delete(p); chip.classList.remove('active'); }
            else { state.activeProtos.add(p); chip.classList.add('active'); }
        });
        protoFiltersEl.appendChild(chip);
    });

    // ---------------------------------------------------------------
    // 5. HISTOGRAM (dynamic, redrawn as counts change)
    // One bar per category. Bar width reflects *recent* activity (see
    // state.recentCounts, which decays each frame in tick()) rather than
    // the all-time total — otherwise every bar's proportion converges to a
    // fixed ratio within the first few seconds and visibly stops moving
    // even though the numbers keep climbing.
    // ---------------------------------------------------------------
    const histEl = document.getElementById('histogram');
    const histRows = {}; // cat -> .hist-fill element (the colored bar itself)
    ATTACK_CATS.forEach(cat => {
        const row = document.createElement('div');
        row.className = 'hist-row';
        row.innerHTML = `
      <span class="hist-label">${cat}</span>
      <span class="hist-track"><span class="hist-fill" style="width:0%; background:var(--${SEVERITY[cat]})"></span></span>
      <span class="hist-val">0</span>
    `;
        histEl.appendChild(row);
        histRows[cat] = row.querySelector('.hist-fill');
        row.dataset.valEl = '';
    });
    const histVals = {}; // cat -> .hist-val element (the number label)
    ATTACK_CATS.forEach(cat => {
        histVals[cat] = histEl.children[ATTACK_CATS.indexOf(cat)].querySelector('.hist-val');
    });

    // Called every animation frame (see tick()) plus immediately whenever
    // an event fires, so both the decaying bars and the running totals
    // stay in sync with state.
    function updateHistogram () {
        // Scale every bar relative to whichever category currently has the
        // highest *recent* count — that category's bar reads as ~100%.
        const max = Math.max(1, ...Object.values(state.recentCounts));
        ATTACK_CATS.forEach(cat => {
            const recent = state.recentCounts[cat];
            histRows[cat].style.width = `${(recent / max) * 100}%`;
            histVals[cat].textContent = state.catCounts[cat];       // all-time total, keeps climbing
            catChipEls[cat].querySelector('.count').textContent = state.catCounts[cat];
        });
    }

    // ---------------------------------------------------------------
    // 6. TOP TALKERS (dynamic ranked list)
    // Ranks hosts by total event count (both as source and destination),
    // excluding the gateway itself since it's involved in every event.
    // ---------------------------------------------------------------
    const talkersEl = document.getElementById('talkers');

    function updateTalkers () {
        const ranked = Object.entries(state.talkerCounts)
            .filter(([id]) => id !== 'gateway')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6); // top 6 only — keeps the panel a fixed, glanceable size
        talkersEl.innerHTML = ranked.map(([id, n]) => `
      <div class="talker-row">
        <span class="ip" data-host="${id}">${id}</span>
        <span class="n">${n}</span>
      </div>
    `).join('') || `<div class="talker-row"><span class="n">no traffic yet</span></div>`;

        // Rebuilding innerHTML above wipes any previous listeners, so they're
        // re-attached every call. Clicking a host isolates it on the graph.
        talkersEl.querySelectorAll('.ip').forEach(el => {
            el.addEventListener('click', () => setFocus(el.dataset.host));
        });
    }

    // ---------------------------------------------------------------
    // 7. LIVE FEED LOG
    // Scrolling terminal-style log of every event, newest at the top
    // (paired with flex-direction:column-reverse in the CSS).
    // ---------------------------------------------------------------
    const logEl = document.getElementById('log');
    const MAX_LOG = 60; // cap so the DOM doesn't grow unbounded over a long replay

    function pushLog (ev) {
        const sev = SEVERITY[ev.attack_cat];
        const entry = document.createElement('div');
        entry.className = `log-entry ${sev}`; // colors the left border per severity
        entry.innerHTML = `<span class="t">${fmtTime(ev.t)}</span><span>${ev.src}</span><span class="arrow">→</span><span>${ev.dst}</span><span>${ev.attack_cat}</span>`;
        logEl.prepend(entry);
        while (logEl.children.length > MAX_LOG) { logEl.removeChild(logEl.lastChild); }
    }

    document.getElementById('clear-log').addEventListener('click', () => { logEl.innerHTML = ''; });

    // ---------------------------------------------------------------
    // 8. NODE FOCUS / ISOLATION (click a host to filter its traffic)
    // When a host is focused, only pulses to/from that host render, and
    // every other node is visually dimmed (see draw()).
    // ---------------------------------------------------------------
    const focusBanner = document.getElementById('focus-banner');
    const focusLabel = document.getElementById('focus-label');

    function setFocus (hostId) {
        state.focusNode = hostId;
        if (hostId) {
            focusBanner.classList.add('show');
            focusLabel.textContent = `isolating ${hostId}`;
        } else {
            focusBanner.classList.remove('show');
        }
    }
    document.getElementById('focus-clear').addEventListener('click', () => setFocus(null));

    // Clicking the canvas toggles focus on whichever node is currently
    // hovered (see the mousemove listener in section 10, which maintains
    // `hoveredNode`). Clicking the same node again clears the focus.
    canvas.addEventListener('click', () => {
        if (hoveredNode) setFocus(state.focusNode === hoveredNode.id ? null : hoveredNode.id);
    });

    // ---------------------------------------------------------------
    // 9. TRANSPORT CONTROLS
    // Play/pause, scrub bar, and speed selector — a fairly standard media
    // player pattern, since this is a replay rather than a live feed.
    // ---------------------------------------------------------------
    const playBtn = document.getElementById('play-btn');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const scrub = document.getElementById('scrub');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const speedSelect = document.getElementById('speed-select');

    function fmtTime (s) {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    }
    timeTotal.textContent = fmtTime(totalTime);

    playBtn.addEventListener('click', () => {
        state.playing = !state.playing;
        iconPlay.style.display = state.playing ? 'none' : 'block';
        iconPause.style.display = state.playing ? 'block' : 'none';
    });

    // Zeroes out every running total — called both when scrubbing (since
    // jumping in time invalidates "totals so far") and when the replay
    // loops back to the start.
    function resetCounts () {
        state.counts = { benign: 0, warn: 0, alert: 0 };
        ATTACK_CATS.forEach(c => { state.catCounts[c] = 0; state.recentCounts[c] = 0; });
        state.talkerCounts = {};
        ['benign', 'warn', 'alert'].forEach(k => document.getElementById(`stat-${k}`).textContent = 0);
        updateHistogram();
        updateTalkers();
        logEl.innerHTML = '';
    }

    // Dragging the scrub bar jumps state.clock directly and fast-forwards
    // nextEventIdx to match, so playback resumes from the right point
    // rather than replaying everything from the start up to that time.
    scrub.addEventListener('input', (e) => {
        state.clock = (Number(e.target.value) / 1000) * totalTime;
        state.nextEventIdx = events.findIndex(ev => ev.t >= state.clock);
        if (state.nextEventIdx === -1) state.nextEventIdx = events.length;
        state.pulses = []; // clear in-flight pulses so nothing looks like it's travelling backwards
        resetCounts();
    });

    speedSelect.addEventListener('change', (e) => { state.speed = Number(e.target.value); });

    // Spacebar toggles play/pause, as in most media players — but only when
    // focus isn't in a text input (there isn't one here, but this guards
    // against it if the page is ever extended).
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault(); // stops the page itself from scrolling on spacebar
            playBtn.click();
        }
    });

    // ---------------------------------------------------------------
    // 10. TOOLTIP
    // Tracks mouse position against node positions and shows a small
    // info box next to whichever node is within range.
    // ---------------------------------------------------------------
    const tooltip = document.getElementById('tooltip');
    let hoveredNode = null; // also read by the canvas click handler above, for isolation

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        let found = null;
        for (const n of nodes) {
            const d = Math.hypot(n.x - mx, n.y - my);
            if (d < 14) { found = n; break; } // 14px hit-radius around each node center
        }
        hoveredNode = found;
        if (found) {
            tooltip.classList.add('show');
            tooltip.style.left = (found.x + 16) + 'px';
            tooltip.style.top = (found.y - 8) + 'px';
            // Most recent event involving this host, searched from the end
            // of the full event list (not just what's played so far) —
            // good enough for a quick "last known" summary.
            const recent = [...events].reverse().find(ev => ev.src === found.id || ev.dst === found.id);
            tooltip.innerHTML = `
        <div class="row"><span class="k">host</span><span>${found.id}</span></div>
        ${recent ? `
        <div class="row"><span class="k">last proto</span><span>${recent.proto}</span></div>
        <div class="row"><span class="k">last cat</span><span>${recent.attack_cat}</span></div>
        ` : ''}
        <div class="row"><span class="k">events seen</span><span>${state.talkerCounts[found.id] || 0}</span></div>
      `;
        } else {
            tooltip.classList.remove('show');
        }
    });

    // ---------------------------------------------------------------
    // 11. ANIMATION LOOP
    // Everything visual — pulse movement, the histogram decay, and the
    // canvas redraw — happens inside tick(), driven by requestAnimationFrame.
    // ---------------------------------------------------------------

    // Reads a CSS custom property's current value — used so canvas draw
    // calls stay in sync with the actual theme colors defined in style.css
    // rather than duplicating hex values in JS.
    function getCss (varName) { return getComputedStyle(document.documentElement).getPropertyValue(varName).trim(); }

    const colorFor = (cat) => {
        const sev = SEVERITY[cat] || 'alert'; // unrecognized category defaults to "alert" rather than silently uncolored
        if (sev === 'benign') return getCss('--benign');
        if (sev === 'warn') return getCss('--warn');
        return getCss('--alert');
    };

    let lastFrame = performance.now();
    let talkersDirty = false, talkersTimer = 0; // throttles Top Talkers re-renders (see below)

    function tick (now) {
        // Delta time since last frame, capped at 100ms so a dropped/slow
        // frame (e.g. tab backgrounded) can't cause a huge jump in the replay.
        const dt = Math.min((now - lastFrame) / 1000, 0.1);
        lastFrame = now;

        if (state.playing) {
            state.clock += dt * state.speed;
            if (state.clock > totalTime) {
                // Reached the end — loop back to the start and clear all totals.
                state.clock = 0;
                state.nextEventIdx = 0;
                resetCounts();
            }
            scrub.value = Math.floor((state.clock / totalTime) * 1000);
            timeCurrent.textContent = fmtTime(state.clock);

            // Emit every event whose timestamp has now been reached. Using a
            // while loop (not just checking the next one) matters at higher
            // playback speeds, where multiple events can fall within one frame.
            while (state.nextEventIdx < events.length && events[state.nextEventIdx].t <= state.clock) {
                emitPulse(events[state.nextEventIdx]);
                state.nextEventIdx++;
            }
        }

        // Advance every in-flight pulse along its src→dst path, then drop
        // any that have finished travelling (progress >= 1).
        state.pulses.forEach(p => p.progress += dt * (1.1 + p.speedJitter));
        state.pulses = state.pulses.filter(p => p.progress < 1);

        // Exponential decay with a ~5s half-life: recent activity fades out
        // smoothly so the histogram keeps reflecting "what's happening now"
        // rather than an all-time total that flattens into fixed ratios.
        const decay = Math.pow(0.5, dt / 5);
        ATTACK_CATS.forEach(c => { state.recentCounts[c] *= decay; });
        updateHistogram();

        // Top Talkers only re-renders a few times a second (rather than
        // every frame) since rebuilding its innerHTML on every single event
        // would be wasteful — a short delay is imperceptible for a ranked list.
        talkersTimer += dt;
        if (talkersDirty && talkersTimer > 0.4) {
            updateTalkers();
            talkersDirty = false;
            talkersTimer = 0;
        }

        draw();
        requestAnimationFrame(tick);
    }

    // Briefly scales up a header stat number when it changes, as a subtle
    // "something just happened" cue. The class is removed shortly after so
    // it can be re-triggered on the next update.
    function bumpStat (key) {
        const el = document.getElementById(`stat-${key}`);
        el.textContent = state.counts[key];
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 150);
    }

    // Called once per event, at the moment its timestamp is reached during
    // playback. Updates every piece of derived state, then — if the event
    // passes the current filters — queues an animated pulse for it.
    function emitPulse (ev) {
        // Always tally talkers + log + counts, even if the event is filtered
        // out of the graph view, so numbers stay meaningful regardless of
        // which filters are currently active.
        state.talkerCounts[ev.src] = (state.talkerCounts[ev.src] || 0) + 1;
        state.talkerCounts[ev.dst] = (state.talkerCounts[ev.dst] || 0) + 1;
        state.catCounts[ev.attack_cat]++;
        state.recentCounts[ev.attack_cat] += 1;
        talkersDirty = true;
        updateHistogram();

        const key = SEVERITY[ev.attack_cat];
        state.counts[key]++;
        bumpStat(key);
        pushLog(ev);

        // Filters below this point only affect what's drawn on the graph —
        // they don't affect any of the counts/logs above.
        if (!state.activeCats.has(ev.attack_cat)) return;
        if (!state.activeProtos.has(ev.proto)) return;
        if (state.focusNode && ev.src !== state.focusNode && ev.dst !== state.focusNode) return;

        const src = nodeById[ev.src], dst = nodeById[ev.dst];
        if (!src || !dst) return; // defensive: skip if a host somehow isn't in the node list
        state.pulses.push({
            src, dst, color: colorFor(ev.attack_cat), progress: 0,
            speedJitter: Math.random() * 0.6, // slight per-pulse speed variation, avoids a robotic uniform pace
            severity: SEVERITY[ev.attack_cat],
        });
    }

    // Full canvas redraw, called once per frame. Draw order matters here:
    // edges first (so they sit behind everything), then nodes, then pulses
    // on top, then labels last so text isn't ever obscured.
    function draw () {
        ctx.clearRect(0, 0, W, H);

        const gateway = nodeById['gateway'];
        // A node (other than the gateway) is "dimmed" whenever a different
        // host is currently focused/isolated.
        const dim = (id) => state.focusNode && id !== state.focusNode && id !== 'gateway';

        // Static mesh: a line from the gateway to every other host, faded
        // out for anything not part of the current focus.
        ctx.lineWidth = 1;
        nodes.forEach(n => {
            if (n === gateway) return;
            ctx.strokeStyle = dim(n.id) ? 'rgba(38,49,61,0.25)' : getCss('--line');
            ctx.beginPath();
            ctx.moveTo(gateway.x, gateway.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
        });

        // Node dots. Gateway is largest/brightest; a focused node is drawn
        // slightly larger and in the accent color to stand out.
        nodes.forEach(n => {
            const isGateway = n.id === 'gateway';
            const isFocused = state.focusNode === n.id;
            ctx.save();
            ctx.globalAlpha = dim(n.id) ? 0.3 : 1;
            ctx.beginPath();
            ctx.arc(n.x, n.y, isGateway ? 10 : (isFocused ? 8 : 6), 0, Math.PI * 2);
            ctx.fillStyle = isGateway ? getCss('--text') : (isFocused ? getCss('--benign') : getCss('--chrome-2'));
            ctx.fill();
            ctx.strokeStyle = isFocused ? getCss('--benign') : getCss('--text-faint');
            ctx.lineWidth = isFocused ? 2 : 1;
            ctx.stroke();
            ctx.restore();
        });

        // Animated pulses: each one is a dot lerped along the straight line
        // from its source to destination node, fading out as it arrives
        // (alpha falls off with progress^3 — a sharper tail-off than linear,
        // so the pulse still reads clearly for most of its travel and only
        // fades right at the very end).
        state.pulses.forEach(p => {
            const x = p.src.x + (p.dst.x - p.src.x) * p.progress;
            const y = p.src.y + (p.dst.y - p.src.y) * p.progress;
            const alpha = 1 - Math.pow(p.progress, 3);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, p.severity === 'alert' ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            // Shadow blur gives attack-severity pulses a small glow, making
            // them read as more urgent than routine/benign traffic.
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.severity === 'alert' ? 12 : 6;
            ctx.fill();
            ctx.restore();
        });

        // Host IP labels, drawn last so they're never obscured by edges or
        // pulses. Gateway is intentionally left unlabeled (it's visually
        // obvious as the central node).
        ctx.font = '10px JetBrains Mono, monospace';
        nodes.forEach(n => {
            if (n.id === 'gateway') return;
            ctx.save();
            ctx.globalAlpha = dim(n.id) ? 0.3 : 1;
            ctx.fillStyle = getCss('--text-faint');
            ctx.fillText(n.id, n.x + 10, n.y + 3);
            ctx.restore();
        });
    }

    // ---- Boot sequence ----
    updateHistogram(); // paint initial (all-zero) state before anything has played
    updateTalkers();
    resize();          // establishes W/H and node positions before the first frame renders
    requestAnimationFrame(tick);
})();