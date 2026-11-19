# -*- coding: utf-8 -*-
"""Перебудувати форму: ПІБ+Клас на початок, без розділів уроків,
правильні відповіді — першими (для швидкого встановлення ключа вручну)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from create_form import get_service, load_questions, FORM_TITLE

FORM_ID = "1Gj1u0-Ssa7RB0NLKe3-8g3xCG9IcVc37GgxM8Yc72nw"

def main():
    service = get_service()
    forms = service.forms()
    form = forms.get(formId=FORM_ID).execute()
    items = form.get("items", [])
    print(f"Було елементів: {len(items)}")

    # Видалити все (у зворотному порядку, щоб індекси не зсувалися)
    reqs = [{"deleteItem": {"location": {"index": i}}}
            for i in range(len(items) - 1, -1, -1)]
    if reqs:
        forms.batchUpdate(formId=FORM_ID, body={"requests": reqs}).execute()
    print("Старі елементи видалено")

    questions = load_questions()
    reqs = []
    # 1-2: ПІБ, Клас — на початок
    for title in ["Прізвище та ім'я", "Клас"]:
        reqs.append({"createItem": {
            "item": {"title": title,
                     "questionItem": {"question": {"required": True, "textQuestion": {}}}},
            "location": {"index": len(reqs)}}})
    # 3+: питання БЕЗ розділів уроків, правильні відповіді — перші
    for i, q in enumerate(questions, 1):
        correct_opts = [q["options"][j] for j in q["correct"]]
        wrong_opts = [o for j, o in enumerate(q["options"]) if j not in q["correct"]]
        ordered = correct_opts + wrong_opts
        qtype = "CHECKBOX" if q["type"] == "Кілька відповідей" else "RADIO"
        reqs.append({"createItem": {
            "item": {
                "title": f"{i}. {q['title']}",
                "description": f"Балів: {q['points']}. Пояснення: {q['explain']}",
                "questionItem": {"question": {
                    "required": True,
                    "choiceQuestion": {"type": qtype, "shuffle": False,
                                       "options": [{"value": o} for o in ordered]},
                }}},
            "location": {"index": len(reqs)}}})

    forms.batchUpdate(formId=FORM_ID, body={"requests": reqs}).execute()

    form = forms.get(formId=FORM_ID).execute()
    items = form.get("items", [])
    print(f"Стало елементів: {len(items)}")
    for it in items:
        print(" -", it.get("title", "")[:90])
    print("\nГотово:", f"https://docs.google.com/forms/d/{FORM_ID}/viewform")

if __name__ == "__main__":
    main()
