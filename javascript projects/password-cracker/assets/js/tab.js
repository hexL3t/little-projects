// Function to switch tabs and reset the expand toggle
function openTab(tabName) {
    console.log(`Opening tab: ${tabName}`);

    // Find all tab content elements and remove the active class and expanded state
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active"); // Deactivate all tabs
        content.classList.remove("expanded"); // Remove expanded state on tab change
    });

    // Remove expanded class from all code containers
    document.querySelectorAll(".code-container").forEach(container => {
        container.classList.remove("expanded");
    });

    // Remove active class from all buttons
    document.querySelectorAll(".tab-button").forEach(button =>
        button.classList.remove("active")
    );

    // Activate the selected tab (but do not toggle the expanded state here)
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add("active");
    } else {
        console.warn(`Tab content with ID '${tabName}' not found.`);
    }

    // Activate the corresponding button (but do not toggle the expanded state here)
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add("active");
    } else {
        console.warn(`Button for tab '${tabName}' not found.`);
    }

    // If the "Progress" tab is clicked, reset all expanded states
    if (tabName === "progress") {
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("expanded"));
        document.querySelectorAll(".code-container").forEach(container => container.classList.remove("expanded"));
        document.querySelectorAll(".view-more-btn").forEach(button => button.classList.remove("expanded"));
    }
}

// Ensure 'progress' tab is active on page load if it's not already set
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded - checking default tab");

    // Attach clear progress event listener
    const clearButton = document.getElementById("clear-progress-btn");
    if (clearButton) {
        clearButton.addEventListener("click", clearProgress);
    }

    // Fetch and display code files
    fetchAndDisplayFile("python");
    fetchAndDisplayFile("javascript");
});

// Function to clear progress and reset UI
function clearProgress() {
    console.log("Clearing progress...");

    const progressList = document.querySelector(".tab-content.active ul");
    const crackValue = document.querySelector(".crack-value p");
    const resultTime = document.querySelector(".result-time p");
    const origPass = document.querySelector(".result-value p");

    if (progressList) {
        progressList.innerHTML = "No password has been entered yet.";
    }

    if (crackValue) {
        crackValue.textContent = "";
    }

    if (resultTime) {
        resultTime.textContent = "Time taken";
    }

    if (origPass) {
        origPass.textContent = "";
    }

    // Optionally reset backend progress
    fetch("/reset_progress", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log("Progress reset:", data);
        })
        .catch(error => {
            console.error("Error resetting progress:", error);
        });
}

// Function to fetch and display code files with line numbers
function fetchAndDisplayFile(language) {
    let rawGitHubURL = "";
    let codeContainerId = "";

    if (language === "python") {
        rawGitHubURL = "https://raw.githubusercontent.com/smlcaffeineaddict/little-projects/refs/heads/main/python-projects/brute-force-password-cracker.py";
        codeContainerId = "pycode-container";
    } else if (language === "javascript") {
        rawGitHubURL = "https://raw.githubusercontent.com/smlcaffeineaddict/password-cracker/blob/main/assets/js/brute-force.js";
        codeContainerId = "jscode-container";
    }

    fetch(rawGitHubURL)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            const codeContainer = document.getElementById(codeContainerId);

            if (!codeContainer) {
                console.error(`Code container not found for ${language}.`);
                return;
            }

            let lineNumbers = "";
            let codeLines = "";

            lines.forEach((line, index) => {
                lineNumbers += `<span class="progress-number">${index + 1}</span><br>`;
                codeLines += `<span class="code-line">${line}</span><br>`;
            });

            codeContainer.innerHTML = `
                <div class="line-numbers-container">${lineNumbers}</div>
                <div class="code-lines">${codeLines}</div>
            `;
        })
        .catch(error => {
            console.error(`Error fetching the ${language} file:`, error);
        });
}

// Handle "View More" functionality for both Python and JavaScript code sections
document.addEventListener("DOMContentLoaded", function () {
    const pyViewMoreButton = document.querySelector("#pycode .view-more-btn");
    const jsViewMoreButton = document.querySelector("#jscode .view-more-btn");

    const pyCodeContainer = document.getElementById("pycode-container");
    const jsCodeContainer = document.getElementById("jscode-container");

    const pyTabContent = document.getElementById("pycode");
    const jsTabContent = document.getElementById("jscode");

    // Get tab container and pwordcracker to handle expanded state toggling
    const tabContainer = document.querySelector(".tab-container");
    const pwordcracker = document.querySelector(".pwc");

    // Function to toggle expanded state
    function toggleExpandedState(tabContent, codeContainer, viewMoreButton) {
        // Remove 'expanded' class from all sections before toggling
        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("expanded"));
        document.querySelectorAll(".code-container").forEach(container => container.classList.remove("expanded"));
        document.querySelectorAll(".view-more-btn").forEach(button => button.classList.remove("expanded"));

        // Now toggle the expanded state for the clicked section
        if (!tabContent.classList.contains("expanded")) {
            tabContent.classList.add("expanded");
            codeContainer.classList.add("expanded");
            viewMoreButton.classList.add("expanded");
        } else {
            // If already expanded, collapse it (remove expanded state)
            tabContent.classList.remove("expanded");
            codeContainer.classList.remove("expanded");
            viewMoreButton.classList.remove("expanded");
        }
    }

    if (pyViewMoreButton) {
        pyViewMoreButton.addEventListener("click", function () {
            // Toggle the expanded state for Python code section only
            toggleExpandedState(pyTabContent, pyCodeContainer, pyViewMoreButton);

            // Ensure tab container and pwordcracker are expanded when Python code is shown
            if (tabContainer) {
                tabContainer.classList.toggle("expanded");
            }
            if (pyCodeContainer) {
                pyCodeContainer.classList.toggle("expanded");
            }   
            if (pwordcracker) {
                pwordcracker.classList.toggle("expanded");
            }
            if (pyTabContent){
                pyTabContent.classList.toggle("expanded");
            }
        });
    } else {
        console.warn("Python View More button not found.");
    }

    // Handle JavaScript 'View More' button click
    if (jsViewMoreButton) {
        jsViewMoreButton.addEventListener("click", function () {
            // Toggle the expanded state for JavaScript code section only
            toggleExpandedState(jsTabContent, jsCodeContainer, jsViewMoreButton);

            // Ensure tab container and pwordcracker are expanded when JavaScript code is shown
            if (tabContainer) {
                tabContainer.classList.toggle("expanded");
            }
            if (pwordcracker) {
                pwordcracker.classList.toggle("expanded");
            }
            if (jsCodeContainer){
                jsCodeContainer.classList.toggle("expanded");
            }
            if (jsTabContent){
                jsTabContent.classList.toggle("expanded");
            }
        });
    } else {
        console.warn("JavaScript View More button not found.");
    }

    // Close expanded view when clicking away from tab content or code container
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.tab-container') && !event.target.closest('.view-more-btn')) {
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('expanded'));
            document.querySelectorAll('.code-container').forEach(container => container.classList.remove('expanded'));
            document.querySelectorAll('.view-more-btn').forEach(button => button.classList.remove('expanded'));
        }
    });
});
