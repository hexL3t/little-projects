# movie_search_app.py
import sqlite3
import tkinter as tk
from tkinter import messagebox
import re

def clean_html(text):
    text = re.sub(r'<.*?>', '', text)           # Remove HTML tags
    text = re.sub(r'&amp;', '&', text)          # Replace HTML entity
    return text.strip()

def search_movies():
    keyword = entry.get().strip()
    if not keyword:
        status_label.config(text="Please enter a keyword.")
        return

    listbox.delete(0, tk.END)
    results.clear()

    conn = sqlite3.connect("movies.db")
    cursor = conn.cursor()
    query = """
    SELECT title, synopsis FROM movies
    WHERE LOWER(title) LIKE ? OR
          LOWER(lead_actor) LIKE ? OR
          LOWER(director) LIKE ? OR
          LOWER(synopsis) LIKE ?
    """
    pattern = f"%{keyword.lower()}%"
    cursor.execute(query, (pattern, pattern, pattern, pattern))
    rows = cursor.fetchall()
    conn.close()

    if rows:
        for title, synopsis in rows:
            listbox.insert(tk.END, title)
            results[title] = synopsis
        status_label.config(text=f"{len(rows)} result(s) found.")
    else:
        status_label.config(text="No results found.")

def show_details(event):
    selected = listbox.curselection()
    if selected:
        title = listbox.get(selected[0])
        cleaned = clean_html(results[title])
        details_text.delete("1.0", tk.END)
        details_text.insert(tk.END, cleaned)

# GUI setup
root = tk.Tk()
root.title("Movie Search App")

tk.Label(root, text="Enter search keyword:").pack()
entry = tk.Entry(root, width=40)
entry.pack()

tk.Button(root, text="Search", command=search_movies).pack()

listbox = tk.Listbox(root, width=50)
listbox.pack()
listbox.bind("<<ListboxSelect>>", show_details)

details_text = tk.Text(root, height=5, width=50)
details_text.pack()

status_label = tk.Label(root, text="")
status_label.pack()

results = {}
root.mainloop()
