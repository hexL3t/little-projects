#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 27 18:48:22 2024

@author: tiamegan
"""
# Weather App using Static Data in a Dictionary

# Define a dictionary to store static weather data
weather_data = {
    "London" : {
        "temperature" : 15,
        "description" : "Partly Cloudy",
        "humidity": 65,
        "wind_speed": 8
        },
    "Tokyo" : {
        "temperature" : 2,
        "description" : "Sunny",
        "humidity": 40,
        "wind_speed": 10
        },
    "New York" : {
        "temperature" : 28,
        "description" : "Rainy",
        "humidity": 75,
        "wind_speed": 5
        }
    # Add more cities and their weather data here
    # After each city {} there is a comma to continue
    }

# Define a function to get weather information for a given city
def get_weather(city):
    # Convert the input city name and dictionary keys to lowercase
    city_lowercase = city.lower()
    weather_data_lowercase = {k.lower(): v for k, v in weather_data.items()}
    
    # Check if the lowercase city exists in the weather data dictionary
    if city_lowercase in weather_data_lowercase:
        # retrieve the weather information for the city
        weather = weather_data_lowercase[city_lowercase]
        return weather
    else:
        # If the city is not found, return None
        return None

# Usage
city_name = input("Enter a City: ")     # Prompt the user to enter a city name
weather_info = get_weather(city_name)   # Call the get_weather function with the user input

# Print the weather information
if weather_info:                                                # Check if weather_info is not None
    print(f"Weather in {city_name}:")                           # Print the city name
    print(f"Temperature: {weather_info['temperature']}°C")      # Print the temperature
    print(f"Description: {weather_info['description']}")        # Print the weather description
    print(f"Humidity: {weather_info['humidity']}%")             # Print the humidity
    print(f"Wind Speed: {weather_info['wind_speed']}m/s")       # Print the wind speed
else:   
    print(f"Weather data for {city_name} not found.")           # Print a message if the city is not found
