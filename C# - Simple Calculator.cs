using System;

// This class represents a simple calculator program
class SimpleCalculator 
{ 

  // Program's entry point
  static void Main(string[] args)
  {
      // Program Display Title
      Console.WriteLine("Welcome to this calculator program");
  
      // Get the first number from the user
      Console.WriteLine("Enter the first number: ");
      double number1 = Convert.ToDouble(Console.ReadLine());
  
      // Get the second number from the user
      Console.WriteLine("Enter your second number: ");
      double number2 = Convert.ToDouble(Console.ReadLine());
  
      // Display the menu of operations
      Console.WriteLine("\nChoose an operation:");
      Console.WriteLine("1. Addition (+) ");
      Console.WriteLine("2. Subtraction (-) ");
      Console.WriteLine("3. Muliplication (*) ");
      Console.WriteLine("4. Division (/) ");
    
      // Get the user's choice of operation
      Console.WriteLine("\nEnter your choice: ");
      int choice = Convert.ToInt32(Console.ReadLine());
  
      // Perform the selected operation based on user input
      double result;
      switch (choice) 
      {
      case 1:
        result = number1 + number2;
        Console.WriteLine("{0} + {1} = {2}", number1, number2, result);
        break;
      case 2:
        result = number1 - number2;
        Console.WriteLine("{0} - {1} = {2}", number1, number2, result);
        break;
      case 3:
        result = number1 * number2;
        Console.WriteLine("{0} * {1} = {2}", number1, number2, result);
        break;
      case 4:
        // Handle division by 0
        if (number2 == 0)
        {
          Console.WriteLine("Error: Division by zero is not allowed.");
        }
        else
        {
          result = number1 / number2;
          Console.WriteLine("{0} / {1} = {2}", number1, number2, result);
        }
        break;
      default:
        Console.WriteLine("Invalid choice. Please select a valid operation.");
        break;
      }
    }
 }