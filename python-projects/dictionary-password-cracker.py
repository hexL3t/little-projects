import time  # Import time module to track the duration of the cracking process

def dictionary_attack(password, dictionary_files=["combined_data.txt"]):
    start_time = time.time()  # Record the start time
    
    # Iterate through each dictionary file
    for dictionary_file in dictionary_files:
        try:
            with open(dictionary_file, "r") as file:
                # Try each password in the current dictionary file
                for line in file:
                    guessed_password = line.strip()  # Remove any leading/trailing whitespace
                    print(f"Trying: {guessed_password}")  # Show current attempt
                    
                    if guessed_password == password:
                        # If the password matches
                        end_time = time.time()  # Record the end time
                        print(f"\nPassword found: {guessed_password}")
                        print(f"Cracking process completed in {end_time - start_time:.3f} seconds.")
                        return
        except FileNotFoundError:
            print(f"Error: Dictionary file '{dictionary_file}' not found.")
    
    # If password is not found in any file
    end_time = time.time() 
    print("Password not found in any of the provided dictionary files.")
    print(f"Cracking attempt completed in {end_time - start_time:.3f} seconds.")

# Example usage
dictionary_attack("p@ssw0rd123")