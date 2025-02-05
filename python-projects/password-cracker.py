import time  # Import the time module to track the duration of the cracking process

def passwordCracker(password):
    startTime = time.time()  # Record the start time to measure how long the cracking process takes
    
    # Define the dictionary of all possible characters for the password (lowercase, uppercase, digits, special characters)
    dictionary = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',  # lowercase letters
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',  # uppercase letters
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',  # digits
        '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '{', '|', '}', '~',  # special characters
    ]
    
    letter = []  # Initialize an empty list to store matched characters progressively
    pWord = password  # Store the input password for comparison
    
    # Loop over each character in the password
    for x in range(0, len(pWord)):
        # Loop through the dictionary to find a matching character for the current password position
        for y in range(0, len(dictionary)):
            if pWord[x] == dictionary[y]:  # If a match is found
                letter.append(dictionary[y])  # Append the matched character to the 'letter' list
                print(f"Current Match: {''.join(letter)}")  # Print the current matched part of the password
                break  # Break out of the inner loop once a match is found, moving on to the next character
    
    # After completing the loop, print the fully matched password
    print(f"\nPassword: {''.join(letter)}") 
    
    # Calculate and print the elapsed time for the password cracking process
    endTime = time.time()  # Record the end time
    elapsedTime = endTime - startTime  # Calculate the elapsed time
    print(f"That took {elapsedTime:.3f} seconds to crack!")  # Print the time with 3 decimal places

# Call the passwordCracker function with a sample password
passwordCracker("L3arn2c0D23!!@@..")
