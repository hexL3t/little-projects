#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May  3 21:31:38 2023

@author: tiamegan
"""

# Importing json module
import json

# Function to load contacts from a JSON file
def load_contacts():
    try:
        with open('contacts.json') as f:
            return json.load(f)                                                 # Returning the loaded JSON data
    except FileNotFoundError:
        return []                                                               # If the file is not found, returning an empty list

# Function to save contacts to a JSON file
def save_contacts(contacts):
    with open('contacts.json', 'w') as f:
        json.dump(contacts,f)                                                   # Writing the JSON data to the file

# Function to add a new contact to the list of contacts
def add_contact(contacts):
    contact = {}
    for field in ['name', 'email', 'mobile', 'notes']:
        contact[field] = input(f'Enter {field}: ')                              # Prompting the user to enter values for each required contact field
        contacts.append(contact)                                                # Adding the new contact to the list of contacts
        save_contacts(contacts)                                                 # Saving the updated list of contacts to the file

# Function to view all contacts in the list
def view_contacts(contacts):
    if not contacts :
        print("No Contacts Found")                                              # Printing a message if there are no contacts in the list
    else:
        for i, contact in enumerate(contacts):                                  # Looping over each contact in the list and displaying their details
            print(f'{i+1}. {" | ".join([f"{k.capitalize()}: {v}" for k, v in contact.items()])}')



# Function to search for contacts based on a given query
def search_contacts(contacts):
    query = input('Enter search query: ').lower()                               # Prompting the user to enter a search query
    results = [contact for contact in contacts                                  # Creating a new list of contacts that match the search query
    if any([query in value.lower() for value in contact.values()])]
    if not results:
        print('No matching contacts found.')                                    # Printing a message if no matching contacts were found
    else:       
        print(f'{len(results)} matching contacts found:')                       # Displaying the list of matching contacts
        view_contacts(results)

# Function to update an existing contact's details
def update_contact(contacts):
    index = int(input('Enter index of contact to update: '))                    # Prompting the user to enter the index of the contact they wish to update
    contact = contacts[index-1]                                                 # Getting the contact object at the given index
    print(f'Editing contact: {contact["name"]}')                                # Displaying the contact's data that will be updated
   
    updated_values = {}
    for field in ['name', 'email', 'phone', 'notes']:
        value = input(f'Enter new {field} ({contact[field]}): ')                # Prompting the user to enter new values for each field (if applicable)
        if value != '':
            updated_values[field] = value
    contact.update(updated_values)                                              # Updating the contact's data with the new values
    save_contacts(contacts)                                                     # Saving the updated list of contacts to the file

#Function to delete a contact from the list
def delete_contact(contacts):                                                   
    index = int(input('Enter index of contact to delete: '))                    # Prompting the user to enter the index of the contact they wish to delete
    contact = contacts.pop(index-1)                                             # Removing the contact object at the given index
    print(f'Deleted contact: {contact["name"]}')                                # Displaying a message to confirm the deletion
    save_contacts(contacts)                                                     # Saving the updated list of contacts to the file



def main():
    # Loading the list of contacts from the file
    contacts = load_contacts()

    while True:
        # Displaying the main menu options
        print('\nWelcome to Contact Book')
        print('1. Add a new contact')
        print('2. View all contacts')
        print('3. Search contacts')
        print('4. Update a contact')
        print('5. Delete a contact')
        print('6. Quit')
        
        try:
            # Prompting the user to enter their choice (as an integer)
            choice = int(input('Enter your choice (1-6): '))
        except ValueError:
            # Displaying an error message if the user's input is not an integer
            print('Invalid choice. Please try again.')
            continue
        
        if choice == 1:
            add_contact(contacts)
        elif choice == 2:
            view_contacts(contacts)
        elif choice == 3:
            search_contacts(contacts)
        elif choice == 4:
            update_contact(contacts)
        elif choice == 5:
            delete_contact(contacts)
        elif choice == 6:
            break
    
    print('Thank you for using Contact Book!')

if __name__ == '__main__':
    main()