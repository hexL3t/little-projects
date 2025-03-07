// Function to introduce random delay (1ms to 3ms per character)
function getRandomDelay(min, max) {
    return Math.random() * (max - min) + min; // Generates random delay between min and max
}

// Function to attempt to "crack" a password by checking each character using a dictionary of common characters
function passwordCracker(password) {
    // Record the start time to calculate how long the cracking process takes (in milliseconds)
    let startTime = performance.now();
    
    // Create a dictionary of possible characters (lowercase, uppercase, numbers, and special characters)
    let dictionary = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', // lowercase letters
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', // uppercase letters
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // digits
        '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '{', '|', '}', '~' // special characters
    ];

    // Initialize an array to track the cracked progress and a string to build the cracked password
    let crackedProgress = [];
    let crackedPassword = "";

    // Loop over each character in the password
    async function crackPassword() {
        for (let i = 0; i < password.length; i++) {
            // Loop through the dictionary to find a matching character for the current password position
            for (let char of dictionary) {
                if (password[i] === char) {  // If a match is found
                    crackedPassword += char;  // Append the matched character to the crackedPassword string
                    crackedProgress.push(crackedPassword);  // Record the current cracked progress
                    console.log(`Current Match: ${crackedPassword}`);  // Display the current cracked password
                    break;  // Break out of the inner loop once a match is found
                }
            }

            // Add a random delay between 1ms and 3ms to simulate time for each character
            let delay = getRandomDelay(1, 3);
            await new Promise(resolve => setTimeout(resolve, delay)); // Await the delay for each character
        }

        // Record the end time to calculate the elapsed time
        let endTime = performance.now();
        let elapsedTimeInMilliseconds = (endTime - startTime);  // Calculate time in milliseconds
        let elapsedTimeInSeconds = elapsedTimeInMilliseconds / 1000;  // Convert to seconds

        // Format the elapsed time for display (milliseconds, seconds, or microseconds)
        let timeFormat;
        if (elapsedTimeInMilliseconds < 1000) {
            timeFormat = `${elapsedTimeInMilliseconds.toFixed(3)} milliseconds`;
        } else {
            timeFormat = `${elapsedTimeInSeconds.toFixed(3)} seconds`;
        }

        // Return the progress made during cracking and the time taken in the desired format
        return { crackedProgress, elapsedTime: timeFormat };
    }

    // Run the crackPassword function and return the result
    return crackPassword();
}

// Call the passwordCracker function with a sample password
let password = "qybhyz-xiKsik-bitdo0";
passwordCracker(password).then(result => {
    console.log(result); // Log the result to the console (cracked progress and time taken)
});
