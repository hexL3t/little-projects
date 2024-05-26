#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Apr  1 20:13:55 2024

@author: tiamegan
"""

base_price = float(input("How much is the base price? : "))
weight = float(input("What is the weight?: "))
distance = float(input("What is the distance?: "))

discount = 0  # No discount by default

if distance > 250 and distance < 500:
    discount = 0.1  # 10% discount
elif distance > 500 and distance < 1000:
    discount = 0.15  # 15% discount
elif distance > 1000:  # Assuming higher discount for longer distance
    discount = 0.20  # 20% discount

shipping_cost = base_price * weight * distance * (1 - discount)

print("The shipping cost is: $", shipping_cost)
