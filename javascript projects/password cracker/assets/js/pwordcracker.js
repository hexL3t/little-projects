function passwordCracker(password) {
    let startTime = performance.now(); // Record start time
    let dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_{|}~".split('');
    let crackedProgress = [];
    let crackedPassword = "";

    for (let i = 0; i < password.length; i++) {
        for (let char of dictionary) {
            if (password[i] === char) {
                crackedPassword += char;
                crackedProgress.push(crackedPassword);
                break; // Stop checking once the correct character is found
            }
        }
    }

    let endTime = performance.now(); // Record end time
    let elapsedTime = endTime - startTime;
    let timeFormat = elapsedTime < 1 ? `${elapsedTime.toFixed(3)} milliseconds` : `${(elapsedTime / 1000).toFixed(3)} seconds`;

    return { crackedProgress, elapsedTime: timeFormat };
}

// Example usage:
let password = "aB1!";
let result = passwordCracker(password);
console.log(result);
