# Importing the tkinter module to create the GUI
from tkinter import *

# Create the main window for the calculator
window = Tk()
window.title("Calculator Program")  # Set the title of the window
window.geometry("500x500")  # Set the dimensions of the window

# Initialize the equation label as a StringVar to link it to the window
equation_text = ""  # This will hold the current input equation
equation_label = StringVar(window)  # Create a StringVar object to update the label
equation_label.set("")  # Initially set the label text to empty

# Function to update the label text when a button is pressed
def button_press(num):
    global equation_text
    equation_text += str(num)  # Add the number pressed to the equation string
    equation_label.set(equation_text)  # Update the label with the new equation

# Function to evaluate the equation when "=" is pressed
def equals():
    global equation_text
    try:
        total = str(eval(equation_text))  # Use eval() to calculate the result of the equation
        equation_label.set(total)  # Display the result in the label
        equation_text = total  # Store the result back in equation_text for further calculations
    except ZeroDivisionError:
        equation_label.set("aritmetic error")  # Handle division by zero errors
        equation_text = ""  # Reset the equation text
    except SyntaxError:
        equation_label.set("syntax error")  # Handle syntax errors in the equation
        equation_text = ""  # Reset the equation text

# Function to clear the current equation
def clear():
    global equation_text
    equation_text = ""  # Reset the equation text
    equation_label.set("")  # Clear the label display

# Function to handle keyboard input
def key_press(event):
    # Check if the key pressed is a number or operator
    if event.char in "0123456789":
        button_press(event.char)
    # Check if the key pressed is an operator
    elif event.char in "+-*/.%":
        button_press(event.char)
    # Check if the Enter key or "=" is pressed to evaluate the equation
    elif event.char == "=" or event.keysym == "Return":
        equals()
    # Check if the 'c' or 'C' key is pressed to clear the equation
    elif event.char == "c" or event.char == "C":
        clear()

# Create the label widget to display the current equation
label = Label(window, textvariable=equation_label, font=('Consolas', 20), bg="white", fg="black", width=24, height=2)
label.pack()  # Add the label to the window

# Create a frame to hold the calculator buttons
frame = Frame(window)
frame.pack()  # Add the frame to the window

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

# Arrange the buttons in a grid layout
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

# Bind the key_press function to keyboard events for handling keyboard input
window.bind("<Key>", key_press)

# Start the Tkinter event loop to display the window
window.mainloop()
