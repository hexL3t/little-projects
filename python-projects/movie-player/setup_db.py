# setup_db.py
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("movies.db")
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    lead_actor TEXT,
    director TEXT,
    synopsis TEXT
)
''')

# Insert sample data
cursor.executemany('''
INSERT INTO movies (title, lead_actor, director, synopsis)
VALUES (?, ?, ?, ?)
''', [
    ("The Great Adventure", "John Smith", "Jane Doe", "<p>An epic journey &amp; thrilling tale.</p>"),
    ("Space Dreams", "Alice Jones", "Bob Brown", "<strong>A vision</strong><br>of the future."),
    ("Mystery in Paris", "David Lee", "Claire Kent", "<em>Murder &amp; intrigue in France.</em>"),
])

conn.commit()
conn.close()