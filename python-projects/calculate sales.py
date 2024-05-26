#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr  7 19:02:47 2024

@author: tiamegan
"""

# Base wage for working up to 37 hours
base_pay = 37 * 36.25

# Worked hours
hours_worked = int(input("How many hours were worked? "))

# Overtime hours
overtime_hours = max(0, hours_worked - 37)  # Ensures overtime_hours is non-negative

# Overtime pay rate
overtime_rate = 36.25 * 1.5

# Overtime pay
overtime_pay = overtime_hours * overtime_rate

# Total pay for hours worked
total_pay_hours = base_pay + overtime_pay

# Number of cars sold
cars_sold = int(input("Total number of cars sold for the week? "))

# Bonus for selling more than 5 cars
bonus = 0
if cars_sold > 5:
  bonus = (cars_sold - 5) * 200

# Total salary
total_salary = total_pay_hours + bonus

# Print total salary
print(f"The salary is ${total_salary:.2f}")
