# First we need to import some special tools (like getting toys out of a toy box)
import turtle   # This lets us draw things on the screen, like having a magic pen!
import random   # This helps us make random choices, like rolling a dice
import time     # This helps us control time, like having a stopwatch

# Setting up our game window (like setting up a board game on a table)
screen = turtle.Screen()   # This creates our game window, like a blank piece of paper
screen.setup(400, 400)    # This makes the window 400 pixels wide and 400 pixels tall (a pixel is like a tiny dot)
screen.title("Simple Snake Game")   # This puts a title on our game window
screen.tracer(0)   # This makes our game run smoothly without flickering

# Creating our snake (like making a character for our game)
snake = turtle.Turtle()   # This creates our snake using the turtle tool
snake.shape("square")     # This makes our snake look like a square
snake.color("green")      # This makes our snake green, like a real snake!
snake.penup()            # This makes sure our snake doesn't draw lines when it moves
snake.goto(0, 0)         # This puts our snake in the middle of the screen
snake.direction = "stop" # This means our snake won't move until we tell it to

# This is where we'll store the body parts of our snake
segments = []   # This is an array (like a special list) that will hold all the parts of our snake's body
                # An array is like a train - we can add or remove cars (segments) and they all follow the engine (snake's head)

# Creating the food for our snake (like putting a treat on the game board)
food = turtle.Turtle()   # This creates the food using the turtle tool
food.shape("circle")     # This makes our food look like a circle
food.color("red")        # This makes our food red, like an apple!
food.penup()             # This makes sure our food doesn't draw lines
food.goto(0, 100)        # This puts our food above the snake to start

# These are the functions that tell our snake how to move (like teaching it different moves)
def go_up():
    # We check if snake isn't going down, because a snake can't suddenly turn around!
    if snake.direction != "down":    
        snake.direction = "up"       # This tells the snake to go up

def go_down():
    # Snake can't go up if it's moving down
    if snake.direction != "up":      
        snake.direction = "down"     # This tells the snake to go down

def go_left():
    # Snake can't go right if it's moving left
    if snake.direction != "right":   
        snake.direction = "left"     # This tells the snake to go left

def go_right():
    # Snake can't go left if it's moving right
    if snake.direction != "left":    
        snake.direction = "right"    # This tells the snake to go right

def move():
    # This function makes all the body parts follow the head
    # It's like a follow-the-leader game!
    
    # Move the end segments first in reverse order
    # This is like moving the last train car first, then the one in front of it, and so on
    for index in range(len(segments)-1, 0, -1):
        x = segments[index-1].xcor()
        y = segments[index-1].ycor()
        segments[index].goto(x, y)
    
    # Move segment 0 to where the head is
    # This is like moving the first train car to where the engine was
    if len(segments) > 0:
        x = snake.xcor()
        y = snake.ycor()
        segments[0].goto(x, y)
    
    # These make the snake actually move in the direction we chose
    # Each time it moves 20 pixels (like taking small steps)
    if snake.direction == "up":
        snake.sety(snake.ycor() + 20)    # Move up 20 pixels
    if snake.direction == "down":
        snake.sety(snake.ycor() - 20)    # Move down 20 pixels
    if snake.direction == "left":
        snake.setx(snake.xcor() - 20)    # Move left 20 pixels
    if snake.direction == "right":
        snake.setx(snake.xcor() + 20)    # Move right 20 pixels

# Setting up the keyboard controls (like connecting buttons to make things happen)
screen.listen()   # This tells the computer to watch for when we press keys
# These lines tell the computer what to do when we press each arrow key
screen.onkeypress(go_up, "Up")       # When up arrow is pressed, snake goes up
screen.onkeypress(go_down, "Down")   # When down arrow is pressed, snake goes down
screen.onkeypress(go_left, "Left")   # When left arrow is pressed, snake goes left
screen.onkeypress(go_right, "Right") # When right arrow is pressed, snake goes right

# This is our main game loop (like keeping the game running)
while True:    # This means "keep doing this forever" (until we close the game)
    screen.update()   # This updates what we see on the screen
    
    # Check if snake touches food (like checking if we caught the treat!)
    if snake.distance(food) < 20:   # If snake is close enough to food (20 pixels)
        # Move food to a new random spot
        x = random.randint(-180, 180)   # Pick a random spot left/right
        y = random.randint(-180, 180)   # Pick a random spot up/down
        food.goto(x, y)                 # Move food to that spot
        
        # Add a new segment to make snake longer
        # This is like adding a new car to our train
        new_segment = turtle.Turtle()      # Create new segment
        new_segment.shape("square")        # Make it square
        new_segment.color("green")         # Make it green
        new_segment.penup()                # Don't draw lines
        segments.append(new_segment)       # Add it to our segments list
    
    move()   # This makes the snake move
    
    # Check if snake hits the walls (Game Over!)
    # This is like checking if we've gone off the game board
    if (snake.xcor() > 190 or snake.xcor() < -190 or 
        snake.ycor() > 190 or snake.ycor() < -190):
        snake.goto(0, 0)           # Put snake back in the middle
        snake.direction = "stop"   # Make it stop moving
        
        # Hide all the body segments
        # This is like putting away all the train cars
        for segment in segments:
            segment.goto(1000, 1000)   # Move them far away (hide them)
        
        # Empty the segments list
        # This is like starting with a new train
        segments.clear()
    
    time.sleep(0.1)   # This makes the game wait a tiny bit (0.1 seconds) before moving again
                      # Like taking a quick breath between moves!

# This keeps our game window open
screen.mainloop()


# © 2024 Copyright TD 