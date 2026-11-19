# -*- coding: utf-8 -*-
"""
Створення Google Форми «Тест: Вебтехнології (уроки 4–7)» через Google Forms API.

Запуск (один раз):
  pip install google-api-python-client google-auth-oauthlib
  python create_form.py

Перед запуском:
  1. Покладіть credentials.json (Desktop client) у ЦЮ папку (google-form-test/).
     НЕ надсилайте його в чат і НЕ комітьте в git.
  2. У Google Cloud Console увімкніть Google Forms API для вашого проєкту.

Перший запуск відкриє браузер: увійдіть у свій акаунт і натисніть Allow.
Після цього скрипт створить форму, надрукує посилання і збереже token.json
(наступні запуски виконуються без браузера).

ВАЖЛИВО: Google Forms API не дозволяє програмно позначати правильні відповіді
(quiz grading) для всіх типів питань. Тому після створення форми відкрийте її
в редакторі і позначте правильні відповіді вручну (ключі — у test-questions.csv,
колонки Correct). Питання, розділи, обов'язковість і порядок створюються повністю.
"""
import csv
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CRED = os.path.join(HERE, "credentials.json")
TOKEN = os.path.join(HERE, "token.json")
CSV_PATH = os.path.join(HERE, "test-questions.csv")

SCOPES = ["https://www.googleapis.com/auth/forms.body"]
FORM_TITLE = "Тест: Вебтехнології (уроки 4–7)"


def get_service():
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    if not os.path.exists(CRED):
        sys.exit(
            "credentials.json не знайдено в папці:\n  " + HERE + "\n"
            "Покладіть туди файл Desktop-клієнта з Google Cloud Console "
            "(НЕ надсилайте його в чат)."
        )

    creds = None
    if os.path.exists(TOKEN):
        creds = Credentials.from_authorized_user_file(TOKEN, SCOPES)
        # Токен прив'язаний до набору скоупів: чужий токен (напр. лише
        # Drive/Docs/Sheets) без forms.body дав би 403 — не використовуємо його,
        # а просимо нову авторизацію з потрібним скоупом.
        if creds and creds.scopes and set(SCOPES) - set(creds.scopes):
            print("Існуючий token.json не містить forms.body — потрібна нова авторизація.")
            creds = None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            from google.auth.transport.requests import Request
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CRED, SCOPES)
            creds = flow.run_local_server(port=0)  # відкриє браузер — увійдіть і Allow
        with open(TOKEN, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return build("forms", "v1", credentials=creds)


def load_questions():
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    qs = []
    for r in rows:
        opts = [r["A"], r["B"], r["C"], r["D"]]
        correct = [ord(ch) - 65 for ch in r["Correct (letters)"].split("+")]
        qs.append({
            "lesson": r["Lesson"],
            "type": r["Type"],          # «Одна відповідь» / «Кілька відповідей»
            "title": r["Question"],
            "options": opts,
            "correct": correct,
            "explain": r["Explanation"],
            "points": int(r["Points"]),
        })
    return qs


def main():
    service = get_service()
    forms = service.forms()

    created = forms.create(body={
        "info": {"title": FORM_TITLE, "documentTitle": FORM_TITLE},
    }).execute()
    form_id = created["formId"]
    print("Створено форму:", form_id)

    # Режим вікторини + опис
    forms.batchUpdate(formId=form_id, body={"requests": [
        {"updateSettings": {
            "settings": {"quizSettings": {"isQuiz": True}},
            "updateMask": "quizSettings"}},
        {"updateFormInfo": {
            "info": {"description": "Уроки 4–7: Box Model, адаптивна верстка, "
                                    "кросбраузерність, графіка. 20 питань, 26 балів."},
            "updateMask": "description"}},
    ]}).execute()

    questions = load_questions()
    requests = []
    current_lesson = None
    for i, q in enumerate(questions, 1):
        if q["lesson"] != current_lesson:
            current_lesson = q["lesson"]
            requests.append({"createItem": {
                "item": {"title": "— " + current_lesson + " —",
                         "pageBreakItem": {}},
                "location": {"index": len(requests)}}})
        qtype = "CHECKBOX" if q["type"] == "Кілька відповідей" else "RADIO"
        requests.append({"createItem": {
            "item": {
                "title": f"{i}. {q['title']}",
                "description": f"Балів: {q['points']}. Пояснення: {q['explain']}",
                "questionItem": {"question": {
                    "required": True,
                    "choiceQuestion": {
                        "type": qtype, "shuffle": False,
                        "options": [{"value": o} for o in q["options"]],
                    },
                }},
            },
            "location": {"index": len(requests)}}})

    # Поля учня на початку (index 0,1 — вставимо окремим запитом на початок)
    name_reqs = [
        {"createItem": {"item": {"title": "Прізвище та ім'я",
                                 "questionItem": {"question": {"required": True,
                                                                "textQuestion": {}}}},
                        "location": {"index": 0}}},
        {"createItem": {"item": {"title": "Клас",
                                 "questionItem": {"question": {"required": True,
                                                                "textQuestion": {}}}},
                        "location": {"index": 1}}},
    ]
    forms.batchUpdate(formId=form_id, body={"requests": name_reqs}).execute()
    forms.batchUpdate(formId=form_id, body={"requests": requests}).execute()

    form = forms.get(formId=form_id).execute()
    print("\nГОТОВО!")
    print("Посилання для учнів:  https://docs.google.com/forms/d/" + form_id + "/viewform")
    print("Редактор форми:      https://docs.google.com/forms/d/" + form_id + "/edit")
    print("\nОстанній крок вручну: у редакторі позначте правильні відповіді")
    print("(ключі — test-questions.csv, колонки Correct) і натисніть Send.")


if __name__ == "__main__":
    main()
