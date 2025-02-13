document.getElementById("password-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form submission

    let password = document.getElementById("password").value;
    let result = passwordCracker(password);  // Call the password cracker function

    // Update original password
    document.getElementById("original-password").textContent = password;

    // Display the cracked password and elapsed time
    document.getElementById("cracked-password").textContent = result.crackedProgress[result.crackedProgress.length - 1];
    document.getElementById("elapsed-time").textContent = result.elapsedTime;

    // Update the progress list with line numbers
    let progressList = document.getElementById("progress-list");
    progressList.innerHTML = '';  // Clear previous progress
    result.crackedProgress.forEach((progress, index) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
                <div class="line-numbers-container">
                    <span class="progress-number">${index + 1}</span><br>
                </div>
                <div class="code-lines">
                    <span class="code-line">${progress}</span><br>
                </div>
            `;
        progressList.appendChild(listItem);
    });
});

document.getElementById("clear-progress-btn").addEventListener("click", function() {
    // Clear progress
    document.getElementById("progress-list").innerHTML = "<p>No password has been entered yet.</p>";
    document.getElementById("original-password").textContent = "";
    document.getElementById("cracked-password").textContent = "";
    document.getElementById("elapsed-time").textContent = "";
});
