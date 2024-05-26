#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May 26 15:24:26 2024

@author: tiamegan
"""

class GoCardAccount:
    def __init__(self, initial_balance):
        self.balance = initial_balance
        self.transactions = [("Initial balance", initial_balance, initial_balance)]

    def record_ride(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            self.transactions.append(("Ride", amount, self.balance))
        else:
            print("Insufficient balance for the ride.")

    def top_up(self, amount):
        self.balance += amount
        self.transactions.append(("Top up", amount, self.balance))

    def get_balance(self):
        return self.balance

    def print_statement(self):
        print("Statement:")
        print("event\t\t\t\tamount ($)\tbalance ($)")
        for transaction in self.transactions:
            event, amount, balance = transaction
            if event == "Initial balance":
                print(f"{event}\t\t\t\t\t\t{amount:.2f}")
            else:
                print(f"{event}\t\t\t\t\t{amount:.2f}\t\t{balance:.2f}")
        print(f"Final balance\t\t\t\t\t\t{self.balance:.2f}")

def main():
    initial_balance = float(input("Creating account. Input initial balance: "))
    account = GoCardAccount(initial_balance)

    while True:
        transaction = input("? ")
        if transaction == "q":
            account.print_statement()
            break
        elif transaction.startswith("r "):
            amount = float(transaction[2:])
            account.record_ride(amount)
        elif transaction.startswith("t "):
            amount = float(transaction[2:])
            account.top_up(amount)
        elif transaction == "b":
            print(f"Balance = ${account.get_balance():.2f}")
        else:
            print("Bad command.")

if __name__ == "__main__":
    main()