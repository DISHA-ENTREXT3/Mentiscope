import sqlite3
import json

def check_db():
    conn = sqlite3.connect('backend/test.db')
    cursor = conn.cursor()
    
    # Get students
    cursor.execute('SELECT id, name FROM student')
    students = cursor.fetchall()
    print(f"Students: {students}")
    
    if students:
        student_id = students[0][0]
        # Get assessments
        cursor.execute('SELECT id, student_id, data FROM assessment WHERE student_id=?', (student_id,))
        assessments = cursor.fetchall()
        print(f"Assessments for {student_id}: {assessments}")
        
    conn.close()

if __name__ == "__main__":
    check_db()
