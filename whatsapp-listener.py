from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

import time
import requests
import logging
from fuzzywuzzy import fuzz

# -- Config --
GROUP_NAME = "פטפוטי פרונדטנדיסטים"
CHECK_INTERVAL = 5  # seconds
WEBHOOK_URL = "https://backend.com/api/log"
MATCH_THRESHOLD = 91
KEY_PHRASES = []

# -- Setup Logging --
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

# -- Setup Chrome --
chrome_options = Options()
chrome_options.binary_location = r"C:\Users\Administrator\Downloads\chrome-win64\chrome-win64\chrome.exe"
chrome_options.add_argument("--user-data-dir=chrome-data")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--remote-debugging-port=9222")
# chrome_options.add_argument("--headless=new")  # Optional

# Use local chromedriver that matches portable Chrome version
driver = webdriver.Chrome(service=Service("chromedriver.exe"), options=chrome_options)
time.sleep(2)
driver.get("https://web.whatsapp.com")

print(">>> Please scan the QR code if needed...")
input(">>> Press Enter after WhatsApp Web is loaded and logged in...")

# -- WhatsApp logic here (unchanged) --

# -- Enter group chat --
def open_group_chat(group_name):
    try:
        search_box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
        search_box.clear()
        search_box.send_keys(group_name)
        time.sleep(2)
        chat = driver.find_element(By.XPATH, f'//span[@title="{group_name}"]')
        chat.click()
    except NoSuchElementException:
        print(f"Group '{group_name}' not found!")
        driver.quit()

# -- Message checker --
last_seen = ""

def check_messages():
    global last_seen
    messages = driver.find_elements(By.CSS_SELECTOR, "div.message-in span.selectable-text span")
    if not messages:
        return
    latest = messages[-1].text
    if latest != last_seen:
        print(f"\n[📥 NEW MESSAGE] \"{latest}\"")
        last_seen = latest
        log_result(latest)

def is_relevant(message):
    for phrase in KEY_PHRASES:
        score = fuzz.partial_ratio(message, phrase)
        print(f"   ↪ Comparing with: \"{phrase}\" → Score: {score}")
        if score >= MATCH_THRESHOLD:
            return True
    return False

def log_result(text):
    try:
        response = requests.post(WEBHOOK_URL_L, json={"data": text})
        logging.info(f"Logged to webhook: {text} (status {response.status_code})")
    except Exception as e:
        logging.error(f"Failed to log result: {e}")

def send_alert(message):
    try:
        logging.info(f"✅ Alert sent (status {response.status_code})")
    except Exception as e:
        logging.error(f"❌ Failed to send alert: {e}")

# -- Run --
open_group_chat(GROUP_NAME)
print(">>> Listening for messages...")

try:
    while True:
        check_messages()
        time.sleep(CHECK_INTERVAL)
except KeyboardInterrupt:
    print("Exiting...")
    driver.quit()
