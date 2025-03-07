document.getElementById("password-form").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent form submission

    let password = document.getElementById("password").value;

    // Record the start time for performance measurement
    let startTime = performance.now();

    // Call the password cracker function and get the result
    let result = await passwordCracker(password); 

    // Simulate delay per character with random delay between 1ms and 3ms
    const minDelay = 1; // Minimum delay in milliseconds
    const maxDelay = 3; // Maximum delay in milliseconds

    function getRandomDelay(min, max) {
        return Math.random() * (max - min) + min; // Generates random delay between min and max
    }

    // Loop through the password characters to simulate the cracking process with a random delay
    let passwordLength = password.length;
    for (let i = 0; i < passwordLength; i++) {
        let simulatedDelay = getRandomDelay(minDelay, maxDelay); // Get random delay for current character
        await new Promise(resolve => setTimeout(resolve, simulatedDelay)); // Apply random delay
    }
    // Record the end time for performance measurement
    let endTime = performance.now();

    // Calculate elapsed time based on start and end time
    let elapsedTimeInMilliseconds = (endTime - startTime);  // Elapsed time in milliseconds
    let elapsedTimeInSeconds = elapsedTimeInMilliseconds / 1000;

    // Update original password
    document.getElementById("original-password").textContent = password;

    // Display the cracked password
    document.getElementById("cracked-password").textContent = result.crackedProgress[result.crackedProgress.length - 1];

    // Truncate to 3 decimal places without rounding
    function truncateToDecimal(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.floor(value * factor) / factor;
    }

    elapsedTimeInMilliseconds = truncateToDecimal(elapsedTimeInMilliseconds, 3);
    elapsedTimeInSeconds = truncateToDecimal(elapsedTimeInSeconds, 3);
    
    // Format the time display with both milliseconds and seconds
    // Format the elapsed time for display (milliseconds and seconds)
    let timeFormat;
    if  (elapsedTimeInMilliseconds >= 100){
        timeFormat = `${elapsedTimeInSeconds} seconds`;
    } else {
        timeFormat = `${elapsedTimeInMilliseconds} milliseconds`;
    }

    // Display the elapsed time
    document.getElementById("elapsed-time").textContent = timeFormat;

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
