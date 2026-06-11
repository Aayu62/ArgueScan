# clean_csv.py
import os

csv_path = os.path.join("backend", "data", "anchors.csv")

csv_content = """text,fallacy_type
"Don't listen to anything they have to say because they are a fundamentally corrupt person.",ad_hominem
"Of course you would argue for that policy; you're just an uneducated idiot who lacks experience.",ad_hominem
"We should completely ignore their research findings because their personal life is an absolute disaster.",ad_hominem
"If we do not pass this strict legislation right this second, absolute chaos and violent crime will destroy our neighborhoods.",fear_mongering
"This radical economic policy will inevitably lead to the total ruin, starvation, and economic collapse of every single family.",fear_mongering
"Be terrified of what happens to our freedom if the opposition wins this upcoming election cycle.",fear_mongering
"You are either completely with our movement, or you are completely against us and want us to fail.",false_dilemma
"We only have two stark choices available: completely shut down our borders or watch our entire infrastructure collapse.",false_dilemma
"There is absolutely no middle ground or room for compromise on this specific structural issue.",false_dilemma
"My opponent wants to completely eliminate all safety regulations, leaving our children completely unprotected.",strawman
"They are arguing to dismantle our entire security system when we just requested minor code updates.",strawman
"The other side wants to completely ban all vehicles instead of simply optimizing emission guidelines.",strawman"""

# Force write the content with explicit utf-8 encoding parameter
with open(csv_path, "w", encoding="utf-8", newline="") as f:
    f.write(csv_content)

print("🚀 anchors.csv has been successfully rewritten in pure UTF-8!")