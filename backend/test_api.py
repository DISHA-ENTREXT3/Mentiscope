import httpx
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_flow():
    # 1. Create Student
    student_data = {
        "name": "Leo",
        "grade_level": "5th Grade",
        "parent_id": "sarah-id"
    }
    r = httpx.post(f"{BASE_URL}/students/", json=student_data)
    print("Create Student:", r.status_code, r.json())
    student_id = r.json()["id"]

    # 2. Submit Weekly Check-in
    checkin_data = {
        "student_id": student_id,
        "assessment_type": "weekly_checkin",
        "data": {
            "mood": 8,
            "focus": 7,
            "challenging_subject": "Math decimals",
            "win_of_the_week": "Read a lot"
        }
    }
    r = httpx.post(f"{BASE_URL}/assessments/submit", json=checkin_data)
    print("Submit Check-in:", r.status_code, r.json())

    # 3. Get Dashboard
    r = httpx.get(f"{BASE_URL}/students/{student_id}")
    print("Get Dashboard:", r.status_code)
    # print(json.dumps(r.json(), indent=2))

if __name__ == "__main__":
    test_flow()
