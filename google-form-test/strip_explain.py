# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from create_form import get_service

FORM_ID = "1Gj1u0-Ssa7RB0NLKe3-8g3xCG9IcVc37GgxM8Yc72nw"

service = get_service()
forms = service.forms()
form = forms.get(formId=FORM_ID).execute()
items = form.get("items", [])

reqs = []
for idx, it in enumerate(items):
    if "description" in it:
        # Зберігаємо лише «Балів: N», пояснення видаляємо повністю
        desc = it["description"]
        points = desc.split(".")[0].strip() if "Балів" in desc else ""
        new_item = {"title": it.get("title", ""), "description": points}
        # questionItem треба передати, щоб не втратити питання при updateItem
        if "questionItem" in it:
            new_item["questionItem"] = it["questionItem"]
        reqs.append({"updateItem": {
            "item": new_item,
            "location": {"index": idx},
            "updateMask": "description"}})

print(f"Оновлюємо елементів: {len(reqs)}")
if reqs:
    forms.batchUpdate(formId=FORM_ID, body={"requests": reqs}).execute()

form = forms.get(formId=FORM_ID).execute()
left = [i.get("description","") for i in form.get("items",[])]
print("Описи після очистки:")
for d in left:
    print(repr(d))
print("Пояснень лишилось:", sum(1 for d in left if "Пояснення" in d))
