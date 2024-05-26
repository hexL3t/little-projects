#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr  1 20:47:14 2024

@author: tiamegan
"""

# Prompt the user to enter three integers and store them in variables
integer1 = int(input("Integer 1? "))
integer2 = int(input("Integer 2? "))
integer3 = int(input("Integer 3? "))

# Find the largest number using max()
largest = max(integer1, integer2, integer3)

# Identify the remaining two numbers using conditional statements
if integer1 != largest:
  if integer2 != largest:
    # num1 and num2 are not largest, so they are the remaining two numbers
    if integer1 > integer2:
      second_largest = integer1
      smallest = integer2
    else:
      second_largest = integer2
      smallest = integer1
  else:
    # num2 is largest, num1 and num3 are remaining numbers
    second_largest = integer1
    smallest = min(integer1, integer3)  # Use min() for efficiency
else:
  # num1 is largest, num2 and num3 are remaining numbers
  second_largest = max(integer2, integer3)  # Use max() for efficiency
  smallest = min(integer2, integer3)  # Use min() for efficiency

# Print the numbers in descending order
print("Descending order:", largest, second_largest, smallest)
