// Function to attempt to "crack" a password by checking each character using a dictionary of common characters
function passwordCracker(password) {
    // Record the start time to calculate how long the cracking process takes (in microseconds)
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
    }

    // Record the end time to calculate the elapsed time
    let endTime = performance.now();    
    let elapsedTimeInMicroseconds = (endTime - startTime) * 1000;           // Calculate elapsed time in microseconds
    let elapsedTimeInMilliseconds = elapsedTimeInMicroseconds / 1000;       // Convert microseconds to milliseconds
    let elapsedTimeInSeconds = elapsedTimeInMilliseconds / 1000;            // Convert milliseconds to seconds

    // Format the elapsed time for display (milliseconds, seconds, or microseconds)
    let timeFormat;
    if (elapsedTimeInMicroseconds < 1) {
        // For times smaller than 1 microsecond, display as microseconds (with 6 decimal places)
        timeFormat = `${elapsedTimeInMicroseconds.toFixed(6)} microseconds`;
    } else if (elapsedTimeInMicroseconds < 1000) {
        // For times smaller than 1 millisecond (1000 microseconds), display as microseconds (with 3 decimal places)
        timeFormat = `${elapsedTimeInMicroseconds.toFixed(3)} microseconds`;
    } else if (elapsedTimeInMicroseconds < 1000000) {
        // For times smaller than 1 second (1000 milliseconds), display as milliseconds (with 3 decimal places)
        timeFormat = `${elapsedTimeInMilliseconds.toFixed(3)} milliseconds`;
    } else {
        // For times greater than 1 second, display as seconds (with 3 decimal places)
        timeFormat = `${elapsedTimeInSeconds.toFixed(3)} seconds`;
    }

    // Return the progress made during cracking and the time taken in the desired format
    return { crackedProgress, elapsedTime: timeFormat };
}

// Call the passwordCracker function with a sample password
let password = "L3arn2c0D23!!@@..";
let result = passwordCracker(password); // Call the passwordCracker function and store the result
console.log(result); // Log the result to the console (cracked progress and time taken)