#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue May  7 12:18:16 2024

@author: tiamegan
"""

# Prompt for source and target file names
source_file = input("Enter the source file name: ")
target_file = input("Enter the target file name: ")


try:
    
    # Open source file for reading
    with open(source_file, 'r') as file:
        lines = file.readlines()
        
    # Remove empty lines and count them
    empty_lines_count = 0
    non_empty_lines = []
    for line in lines:
       if line.strip():
           non_empty_lines.append(line)
       else:
           empty_lines_count += 1

   # Open target file for writing
    with open(target_file, 'w') as file:
       file.writelines(non_empty_lines)

    print(f"Lines removed: {empty_lines_count}")
    
except FileNotFoundError:
    print(f"Error: {source_file} not found.")
except Exception as e:
    print(f"Error: {e}")