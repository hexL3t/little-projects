using System;
using System.Linq;

// Core Class for the password Validation program
class Program
{
    // Entry Point of the Program
    static void Main(string[] args)
    {
        // Store the correct password (Can be changed)
        const string correctPassword = "Secret@123"; 

        // Variables the track password attempts
        int attempts = 0;
        const int maxAttempts = 3;  // Maximum allowed attempts

        // Display a sign-in prompt
        Console.WriteLine("== S I G N  I N == ");
        Console.WriteLine("Hiya!");

        // Start a do-while loop for password attempts
        do
        {
            // Prompt the user to enter their password
            Console.WriteLine("Please enter your password: ");
            string password = Console.ReadLine();

            // Validate the password and check if it matches the correct password
            if (IsValidPassword(password) && password == correctPassword)
            {
                // If correct, display welcome message
                Console.WriteLine("Welcome!");
                break;  // Exit the loop if successful
            }
            else
            {  
                // Increment the attempt counter and display an error message.
                attempts++;
                Console.WriteLine("Incorrect password. You have {0} attempts remaining.", maxAttempts - attempts);
            }
        } while (attempts < maxAttempts);

        // If the maximum attempts are reached, display a message and exit.
        if (attempts == maxAttempts)
        {
            Console.WriteLine("Too many attempts. Goodbye.");
        }
    }

    // Function to check if a password meets complexity requirements
    static bool IsValidPassword(string password)
    {
      // Ensure the password contains a letter, a digit, and a special character
      return password.Any(char.IsLetter) && password.Any(char.IsDigit) && password.Any(char.IsSymbol);
    }
}