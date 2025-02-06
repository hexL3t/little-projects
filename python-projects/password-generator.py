import random  

def passwordGenerator():
    # Get user input for password length
    while True:
        try:
            length = int(input("Enter password length (minimum 8 characters): "))
            if length < 8:
                print("Password length should be at least 8 characters.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")

    # Define the dictionary of all possible characters
    dictionary = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',  
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',  
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',  
        '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '{', '|', '}', '~'  
    ]

    # Generate random core password
    core_password = [random.choice(dictionary) for _ in range(length)]

    # **Obfuscation Methods**
    if length > 12:  
        split_point = random.randint(5, length - 5)  
        core_password[:split_point] = reversed(core_password[:split_point])  

    padding_chars = ['#', '$', '%', '&', '!', '@']  
    for _ in range(3):  
        insert_index = random.randint(0, len(core_password) - 1)  
        core_password.insert(insert_index, random.choice(padding_chars))  

    generated_password = ''.join(core_password)  

    # Print the generated password
    print(f"\nGenerated Password: {generated_password}")  

# Run the password generator
passwordGenerator()
