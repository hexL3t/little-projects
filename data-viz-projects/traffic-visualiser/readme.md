# traffic-visualizer

**Network intrusion replay, in the browser.** Animates UNSW-NB15 traffic as a live packet capture — hosts arranged around a gateway, attack traffic pulsing between them in real time, filterable by category and protocol.

![Traffic visualizer overview](/traffic-visualiser/assets/img/overview.png)

## What it does

Traffic events replay on a timeline (play/pause, scrub, 0.5×–4× speed) and render as animated pulses travelling between hosts on a canvas graph. Each pulse is color-coded by severity — cyan for normal traffic, amber for reconnaissance/analysis-type activity, red for exploits, DoS, backdoors, and the rest of the attack categories.

Alongside the graph:
- **Category & protocol filters** — toggle any combination of the 10 UNSW-NB15 attack categories and 3 protocols to isolate what's shown
- **Distribution histogram** — live per-category bar chart, weighted toward recent activity so it stays visually dynamic across a full replay rather than flattening into fixed proportions
- **Top Talkers** — ranked list of the most active hosts, click one to isolate its traffic on the graph
- **Live event feed** — scrolling terminal-style log of every event as it fires
- **Click-to-isolate** — click any host on the graph itself to dim everything except its traffic

## Data

Built against [UNSW-NB15](https://research.unsw.edu.au/projects/unsw-nb15-dataset), a labelled network intrusion dataset spanning 10 traffic classes (Normal + 9 attack categories: Reconnaissance, Fuzzers, Analysis, Exploits, DoS, Generic, Backdoor, Shellcode, Worms).

The page loads `assets/data/unsw-nb15-sample.csv` — a small (~2,000-row) random sample, trimmed from the full dataset via the script in `scripts/make_sample.py` since the source files run into the hundreds of MB. If that file isn't present, the page falls back automatically to a synthetic traffic generator shaped to the same schema, so it never breaks with data missing.

## Stack

No frameworks, no build step — plain HTML/CSS/JS, rendered directly to a `<canvas>`. [PapaParse](https://www.papaparse.com/) handles CSV parsing client-side.

```
traffic-visualizer/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── data/unsw-nb15-sample.csv
└── scripts/
    └── make_sample.py   # trims the full UNSW-NB15 CSV down to a repo-sized sample
```

## Running locally

Serve it over HTTP rather than opening the file directly — `fetch()` (used to load the CSV) is blocked on `file://` URLs by the browser.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- Node positions and the CSV → event mapping are documented inline in `main.js`
- Falls back gracefully if the dataset's IP columns aren't present (true of the `training-set`/`testing-set` CSV variants, which strip real IPs for the ML classification task) by assigning consistent pseudo-hosts instead