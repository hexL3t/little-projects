#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr 23 20:44:42 2024

@author: tiamegan
"""

import math

carpet_width = 3.66

def findLength(num1, num2):
    if num1 > num2:
        length = num1
        width = num2
    else:
        length = num2
        width = num1
    return length, width

def totalmeter(side1, side2):
    calculatedSide = math.ceil(side2/carpet_width)
    daBigNumber = side1 * calculatedSide
    daBigNumber = math.ceil(daBigNumber)
    return daBigNumber

def main():
    inputtednum1 = None
    inputtednum2 = None

    while inputtednum1 != 0 or inputtednum2 != 0:
        try:
            inputtednum1 = float(input("Enter room dimension 1(m): "))
            inputtednum2 = float(input("Enter room dimension 2(m): "))
        except ValueError:
            print("Invalid input. Please enter numbers only.")
            continue

        if inputtednum1 == 0 and inputtednum2 == 0:
            break

        # Swap and assign numbers
        length, width = findLength(inputtednum1, inputtednum2)

        # Print the results
        print("Length of room:", length)
        print("Width of room:", width)
        totalLengthways = str(totalmeter(length, width))
        totalWidthways = str(totalmeter(width, length))
        print("Total carpet length required in lengthways manner:", totalLengthways)
        print("Total carpet length required in widthways manner:", totalWidthways, "/n")

if __name__ == '__main__':
    main()