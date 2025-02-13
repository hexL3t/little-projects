// Function to attempt to "crack" a password by checking each character using a dictionary of common characters
function passwordCracker(password) {
    // Record the start time to calculate how long the cracking process takes
    let startTime = performance.now();
    
    // Create a dictionary of possible characters (lowercase, uppercase, numbers, and special characters)
    let dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}~".split('');
    
    // Initialize an array to keep track of the cracked progress (step-by-step construction of the password)
    let crackedProgress = [];
    
    // Initialize the cracked password as an empty string
    let crackedPassword = "";

    // Loop through each character in the given password
    for (let i = 0; i < password.length; i++) {
        // Check each character in the dictionary to find a match with the current character in the password
        for (let char of dictionary) {
            if (password[i] === char) {
                // Once a match is found, add the character to the crackedPassword
                crackedPassword += char;
                
                // Record the current progress (cracked password so far)
                crackedProgress.push(crackedPassword);
                
                // Stop checking other characters in the dictionary once a match is found
                break;
            }
        }
    }

    // Record the end time to calculate the time it took to crack the password
    let endTime = performance.now();
    
    // Calculate the time taken by subtracting start time from end time
    let elapsedTime = endTime - startTime;
    
    // Format the elapsed time in a human-readable format (milliseconds or seconds)
    let timeFormat = elapsedTime < 1 ? `${elapsedTime.toFixed(3)} milliseconds` : `${(elapsedTime / 1000).toFixed(3)} seconds`;

    // Return the progress made during cracking and the time taken in the desired format
    return { crackedProgress, elapsedTime: timeFormat };
}

// Example usage: define a password to crack
let password = "aB1!";

// Call the passwordCracker function and store the result
let result = passwordCracker(password);

// Log the result to the console (cracked progress and time taken)
console.log(result);
