import re
from fuzzywuzzy import fuzz

# -- Config --
MATCH_THRESHOLD = 98
KEY_PHRASES = [

]

chat_path = "sample.txt"
with open(chat_path, encoding="utf-8") as f:
    lines = f.readlines()

match_count = 0
total_checked = 0

print(">>> Running static analysis on exported chat...\n")

for line in lines:
    # Only process valid messages
    if " - " not in line or ": " not in line:
        continue

    try:
        msg = line.split(" - ", 1)[1].split(": ", 1)[1].strip()
    except IndexError:
        continue

    if not msg:
        continue

    total_checked += 1
    print(f"\n[📥 NEW MESSAGE] \"{msg}\"")

    matched = False
    for phrase in KEY_PHRASES:
        score = fuzz.partial_ratio(msg, phrase)
        print(f"   ↪ Comparing with: \"{phrase}\" → Score: {score}")
        if score >= MATCH_THRESHOLD:
            matched = True

    if matched:
        print(f"   ✅ MATCH FOUND!")
        match_count += 1
    else:
        print(f"   ❌ No match found")

print(f"\n=== Static Test Complete ===")
print(f"Total checked: {total_checked}")
print(f"Matches found: {match_count}")
print(f"False negatives: {total_checked - match_count}")
