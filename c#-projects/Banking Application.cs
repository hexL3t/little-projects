// Include necessary libraries for user input and data structures
using System;
using System.Collections.Generic;

public class Bank
{
    // Dummy user credentials for testing purposes (replace with actual authentication mechanism)
    private string _verifiedUsername = "John.Doe";
    private string _verifiedName = "John Doe";
    private string _verifiedPassword = "Password123";

    // Dictionary to store user accounts with username as key and user info as value
    private Dictionary<string, Dictionary<string, object>> _userAccounts = new Dictionary<string, Dictionary<string, object>>();

    // Login method to authenticate users
    public bool Login(string username, string password)
    {
        // Set login attempts to 3
        int attempts = 3;

        while (attempts > 0)
        {
            // Prompt for username and password inside the loop if login fails
            Console.Write("Enter Username: ");
            username = Console.ReadLine();
            Console.Write("Enter Password: ");
            password = Console.ReadLine();

            // Check verified credentials first (for testing)
            if (username == _verifiedUsername && password == _verifiedPassword)
            {
                Console.WriteLine($"\nWelcome {_verifiedName}!");
                return true;
            }
            // Then check user accounts dictionary
            else if (_userAccounts.ContainsKey(username) && (string)_userAccounts[username]["password"] == password)
            {
                Console.WriteLine($"\nWelcome {(string)_userAccounts[username]["name"]}!");
                return true;
            }
            else
            {
                Console.WriteLine("ERROR: Invalid username or password.");
                attempts--;

                if (attempts == 0)
                {
                    Console.WriteLine("Maximum login attempts reached. \nPlease try again later.");
                    return false;
                }

                Console.WriteLine($"\nRemaining Attempts: {attempts}");
                Console.WriteLine("1: Try Again \t 2: Main Menu \t 3: Exit");

                int choice = Convert.ToInt32(Console.ReadLine());
                if (choice == 2)
                {
                    return false; // Return to main menu (not implemented here)
                }
                else if (choice == 3)
                {
                    Environment.Exit(0); // Quit the Application
                }
            }
        }

        // Return false if login is unsuccessful after all attempts
        return false;
    }

    // Signup method to create new user accounts
    public void Signup()
    {
        // Declare variables to store user information
        string newUsername, newEmail, newName, newPassword;
        int newAge;
        string newPhone;

        // Prompt the user for personal information
        Console.Write("Enter your name: ");
        newName = Console.ReadLine();
        Console.Write("Enter a new username: ");
        newUsername = Console.ReadLine();
        Console.Write("Enter a new email: ");
        newEmail = Console.ReadLine();
        Console.Write("Enter your age: ");
        newAge = Convert.ToInt32(Console.ReadLine());
        Console.Write("Enter your phone number: ");
        newPhone = Console.ReadLine();
        Console.Write("Enter a new password: ");
        newPassword = Console.ReadLine();

        // Check if any field is empty
        if (string.IsNullOrEmpty(newUsername) || string.IsNullOrEmpty(newEmail) || newAge == 0 || string.IsNullOrEmpty(newPhone) || string.IsNullOrEmpty(newPassword))
        {
            Console.WriteLine("ERROR: Please enter all the details correctly.");
            return;
        }

        // Check if the username is already taken
        if (_userAccounts.ContainsKey(newUsername))
        {
            Console.WriteLine("ERROR: This username is already taken. Please choose a different one.");
            return;
        }

        // Create a new dictionary to store user information
        Dictionary<string, object> userInfo = new Dictionary<string, object>
        {
            { "name", newName },
            { "email", newEmail },
            { "age", newAge },
            { "phone", newPhone },
            { "password", newPassword }
        };

        // Add the new user account to the dictionary
        _userAccounts.Add(newUsername, userInfo);

        Console.WriteLine("Signup successful! Proceeding to login...");
        Console.WriteLine("====== Bank Login ======");

        // Attempt to log in with the new credentials
        if (Login(newUsername, newPassword))
        {
            Console.WriteLine("Welcome to the Bank!");
            Program.MainMenu(this);
        }
        else
        {
            Console.WriteLine("ERROR: Login failed. Please try again.");
        }
    }

    // Methods of functionalities like View Balance, Deposit, Withdraw, Transfer, and Logout
    // Method to display user's current balance (placeholder for actual balance logic)
    public void ViewBalance()
    {
        Console.WriteLine("** View Balance Functionality Not Implemented Yet **");
        Console.WriteLine("Your current balance information would be displayed here.\n");
    }

    // Method to handle user deposits (placeholder for actual deposit logic)
    public void Deposit()
    {
        Console.WriteLine("** Deposit Functionality Not Implemented Yet **");
        Console.WriteLine("Deposit options would be displayed here.\n");
    }

    // Method to handle user withdrawals (placeholder for actual withdrawal logic)
    public void Withdraw()
    {
        Console.WriteLine("** Withdraw Functionality Not Implemented Yet **");
        Console.WriteLine("Withdrawal options would be displayed here.\n");
    }

    // Method to handle user transfers (placeholder for actual transfer logic)
    public void Transfer()
    {
        Console.WriteLine("** Transfer Functionality Not Implemented Yet **");
        Console.WriteLine("Transfer options would be displayed here.\n");
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        Bank bank = new Bank();

        while (true)
        {
            Console.WriteLine("\n====== Bank Menu ======");
            Console.WriteLine(" 1: Login \n 2: Sign Up \n 3: Exit");
            Console.WriteLine("\nSelect an option: ");

            int choice = Convert.ToInt32(Console.ReadLine());

            switch (choice)
            {
                case 1:
                    Console.WriteLine("====== Bank Login ======");
                    // Call the Login method
                    bool isLoggedIn = bank.Login("", "");
                    if (isLoggedIn)
                    {
                        // Perform actions after successful login
                        Console.WriteLine("Welcome to the Bank!");
                        MainMenu(bank);
                    }
                    break;
                case 2:
                    Console.WriteLine("====== Bank Sign Up ======");
                    // Call the SignUp method
                    bank.Signup();
                    break;
                case 3:
                    Console.WriteLine("Exiting the application...");
                    Console.WriteLine("Thank you for using our banking services!");
                    return;
                default:
                    // Handle login failure
                    Console.WriteLine("ERROR: Invalid choice. Please try again.\n\n");
                    break;
            }
        }
    }

    public static void MainMenu(Bank bank)
    {

        bool stayLoggedIn = true;
        while (stayLoggedIn)
        {
            Console.WriteLine("\n====== Main Menu ======");
            Console.WriteLine(" 1: View Balance \n 2: Deposit \n 3: Withdraw \n 4: Transfer \n 5: Logout");
            Console.WriteLine("\nSelect an option: ");
            int choice = Convert.ToInt32(Console.ReadLine());
            switch (choice)
            {
                case 1:
                    // Call the ViewBalance method
                    bank.ViewBalance();
                    break;
                case 2:
                    // Call the Deposit method
                    bank.Deposit();
                    break;
                case 3:
                    // Call the Withdraw method
                    bank.Withdraw();
                    break;
                case 4:
                    // Call the Transfer method
                    bank.Transfer();
                    break;
                case 5:
                    // Call the Logout method
                    stayLoggedIn = false; // Exit the loop
                    Console.WriteLine("Signing Out...");
                    Console.WriteLine("Successful. Logged Out.");
                    break;
                default:
                    Console.WriteLine("ERROR: Invalid choice. Please try again.");
                    break;
            }
        }
    }
}
