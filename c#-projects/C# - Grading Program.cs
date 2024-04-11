using System;

// Main class for the grading program
class Program
{
  // Main method for the program
  static void Main(string[] args)
  {
    // Display program title
    Console.WriteLine("=== G R A D I N G  P R O G R A M ===");

    // Prompt user to enter their score
    Console.WriteLine("Enter your numeric grade (0-100):");

    // Get user input and convert to a double
    double score;
    while (!double.TryParse(Console.ReadLine(), out score))
    {
      Console.WriteLine("Invalid Input. Please enter a numeric score.");
    }

    // Validating the score to ensure it's within the valid range
    if (score < 0 || score > 100)
    {
      Console.WriteLine("Invalid score. Please enter a score between 0 and 100.");
    }
    else 
    {
      // Determine the grade based on the score
      string grade;
      if (score >= 85 && score <= 100)
      {
        grade = "High Distinction";
      }
      else if (score >= 75 && score <= 84)
      {
        grade = "Distinction";
      }
      else if (score >= 65 && score <= 74)
      {
        grade = "Credit";
      }
      else if (score >= 55 && score <= 64)
      {
        grade = "Pass";
      }
      else 
      {
        grade = "Fail";
      }

      // Display the results
      Console.WriteLine("\n== Results ==");
      Console.WriteLine("Score: {0}", score);
      Console.WriteLine("Grade: {0}", grade);
      Console.WriteLine("=============");
    }
  }
}
