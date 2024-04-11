#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  3 21:56:16 2023

@author: tiamegan
"""

# Import necessary modules
import os
import sys

# Function to display menu options
def display_menu():
    print("1. Add task")
    print("2. View tasks")
    print("3. Edit task")
    print("4. Delete task")
    print("5. Exit")
    
# Function to add a task to the To-Do list
def add_task():
    # Get user input for new task
    task = input("Enter task: ")
    # Append new task to existing tasks file
    with open("tasks.txt", "a") as f:
        f.write(task + "\n")
    # Display success message
    print("Task added successfully")
    
# Function to view all tasks in the To-Do list
def view_tasks():
    # Read all tasks from file
    with open("tasks.txt", "r") as f:
        tasks = f.readlines()
        # If tasks exist, print them with their numbers
        if tasks:
            for i, task in enumerate(tasks):
                print(f"{i+1}. {task.strip()}")
        else:
            # If no tasks exist, print message
            print("No tasks found")

# Function to edit an existing task in the To-Do list
def edit_task():
    # Call view_tasks function to show current tasks
    view_tasks()
    # Get user input for task number to edit
    task_num = int(input("Enter task number to edit: "))
    # Read all tasks from file
    with open("tasks.txt", "r") as f:
        tasks = f.readlines()
    # If valid task number is entered, ask user for new task and update file
    if len(tasks) >= task_num:
        tasks[task_num-1] = input("Enter new task: ") + "\n"
        with open("tasks.txt", "w") as f:
            f.writelines(tasks)
        # Display success message
        print("Task updated successfully")
    else:
        # If invalid task number is entered, print error message
        print("Invalid task number")
        
# Function to delete an existing task from the To-Do list
def delete_task():
    # Call view_tasks function to show current tasks
    view_tasks()
    # Get user input for task number to delete
    task_num = int(input("Enter task number to delete: "))
    # Read all tasks from file
    with open("tasks.txt", "r") as f:
        tasks = f.readlines()
    # If valid task number is entered, delete task and update file
    if len(tasks) >= task_num:
        del tasks[task_num-1]
        with open("tasks.txt", "w") as f:
            f.writelines(tasks)
        # Display success message
        print("Task deleted successfully")
    else:
        # If invalid task number is entered, print error message
        print("Invalid task number")
        
# Main function to run the To-Do list application
def main():
    while True:
        display_menu()
        # Get user input for menu choice
        choice = input("Enter your choice: ")
        # Call relevant function based on user choice
        if choice == "1":
            add_task()
        elif choice == "2":
            view_tasks()
        elif choice == "3":
            edit_task()
        elif choice == "4":
            delete_task()
        elif choice == "5":
            # Exit program if user chooses to exit
            print("Exiting program...")
            sys.exit()
        else:
            # Print error message if invalid choice is entered
            print("Invalid choice, please try again")
            
if __name__ == "__main__":
    main()
