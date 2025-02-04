from tkinter import *  # Import Tkinter module for GUI development

# Create main window first
window = Tk()  # Initializes the main window
window.title("Calculator Program")  # Set window title
window.geometry("500x500")  # Set window size (width x height)

# Initialize the equation label as a StringVar and link to window
equation_text = ""  # Store the current equation as a string
equation_label = StringVar(window)  # Create a Tkinter StringVar to manage the equation display
equation_label.set("")  # Initialize the equation label with an empty string

# Function to update the label text when a button is pressed
def button_press(num):
    global equation_text  # Access the global equation_text variable
    equation_text += str(num)  # Append the pressed number or operator to the equation
    equation_label.set(equation_text)  # Update the label with the new equation text

# Function to calculate the result of the equation when '=' button is pressed
def equals():
    global equation_text  # Access the global equation_text variable
    try:
        total = str(eval(equation_text))  # Evaluate the mathematical expression in equation_text
        equation_label.set(total)  # Display the result in the label
        equation_text = total  # Update equation_text with the result
    except ZeroDivisionError:  # Handle division by zero error
        equation_label.set("aritmetic error")  # Display error message in label
        equation_text = ""  # Reset equation_text to empty string
    except SyntaxError:  # Handle invalid syntax errors (e.g., missing operator)
        equation_label.set("syntax error")  # Display error message in label
        equation_text = ""  # Reset equation_text to empty string

# Function to clear the equation when 'AC' button is pressed
def clear():
    global equation_text  # Access the global equation_text variable
    equation_text = ""  # Reset the equation text to an empty string
    equation_label.set("")  # Reset the label to show an empty string

# Display label to show the current equation or result
label = Label(window, textvariable=equation_label, font=('consolas', 20), bg="white", fg="black", width=26, height=2)
label.pack()  # Pack the label into the window to display it

# Frame for buttons to hold all the calculator buttons
frame = Frame(window)
frame.pack()  # Pack the frame into the window

# Set up the buttons for digits and operations
button1 = Button(frame, text="1", height=4, width=6, font=35, command=lambda:button_press(1))
button2 = Button(frame, text="2", height=4, width=6, font=35, command=lambda:button_press(2))
button3 = Button(frame, text="3", height=4, width=6, font=35, command=lambda:button_press(3))
button4 = Button(frame, text="4", height=4, width=6, font=35, command=lambda:button_press(4))
button5 = Button(frame, text="5", height=4, width=6, font=35, command=lambda:button_press(5))
button6 = Button(frame, text="6", height=4, width=6, font=35, command=lambda:button_press(6))
button7 = Button(frame, text="7", height=4, width=6, font=35, command=lambda:button_press(7))
button8 = Button(frame, text="8", height=4, width=6, font=35, command=lambda:button_press(8))
button9 = Button(frame, text="9", height=4, width=6, font=35, command=lambda:button_press(9))
button0 = Button(frame, text="0", height=4, width=6, font=35, command=lambda:button_press(0))

# Set up the buttons for the operators
plus = Button(frame, text="+", height=4, width=6, font=35, command=lambda:button_press('+'))
minus = Button(frame, text="-", height=4, width=6, font=35, command=lambda:button_press('-'))
divide = Button(frame, text="/", height=4, width=6, font=35, command=lambda:button_press('/'))
multiply = Button(frame, text="*", height=4, width=6, font=35, command=lambda:button_press('*'))
percent = Button(frame, text="%", height=4, width=6, font=35, command=lambda:button_press('%'))
equal = Button(frame, text="=", height=4, width=6, font=35, command=equals)
decimal = Button(frame, text=".", height=4, width=6, font=35, command=lambda:button_press('.'))
clear_button = Button(frame, text="AC", height=4, width=6, font=35, command=clear)

# Arrange buttons in a grid layout, specifying the row and column for each button
clear_button.grid(row=0, column=0) 
percent.grid(row=0, column=2)
divide.grid(row=0, column=3)

button7.grid(row=1, column=0)
button8.grid(row=1, column=1)
button9.grid(row=1, column=2)
multiply.grid(row=1, column=3)

button4.grid(row=2, column=0)
button5.grid(row=2, column=1)
button6.grid(row=2, column=2)
minus.grid(row=2, column=3)

button1.grid(row=3, column=0)
button2.grid(row=3, column=1)
button3.grid(row=3, column=2)
plus.grid(row=3, column=3)

button0.grid(row=4, column=1)
decimal.grid(row=4, column=2)
equal.grid(row=4, column=3)

# Start the Tkinter event loop to display the window and respond to user actions
window.mainloop()
