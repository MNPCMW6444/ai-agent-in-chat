import time
import requests
import logging
import argparse
import hashlib

from fuzzywuzzy import fuzz
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import NoSuchElementException

parser = argparse.ArgumentParser(description="Generic WhatsApp Web Listener")
parser.add_argument("--chat", required=True, help="Name of WhatsApp chat (group or individual) to monitor")
parser.add_argument("--webhook", required=True, help="Base webhook URL (no trailing slash)")
parser.add_argument("--interval", type=int, default=5, help="Message check interval in seconds")
parser.add_argument("--phrases", nargs="*", default=[], help="Optional list of alert trigger phrases")
parser.add_argument("--threshold", type=int, default=90, help="Matching threshold for phrases")
parser.add_argument("--chrome-path", default="chrome-win64/chrome.exe", help="Path to Chrome executable")
parser.add_argument("--chromedriver", default="chromedriver.exe", help="Path to chromedriver")
parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
args = parser.parse_args()

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

chrome_options = Options()
chrome_options.binary_location = args.chrome_path
chrome_options.add_argument("--user-data-dir=chrome-data")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--remote-debugging-port=9222")
if args.headless:
    chrome_options.add_argument("--headless=new")

driver = webdriver.Chrome(service=Service(args.chromedriver), options=chrome_options)

time.sleep(2)
driver.get("https://web.whatsapp.com")

print(">>> Please scan the QR code if needed...")
input(">>> Press Enter after WhatsApp Web is loaded and logged in...")

def open_chat(chat_name):
    try:
        search_box = driver.find_element(By.XPATH, '//div[@contenteditable="true" and @role="textbox"]')
        search_box.clear()
        search_box.send_keys(chat_name)
        time.sleep(2)
        chat = driver.find_element(By.XPATH, f'//span[@title="{chat_name}"]')
        chat.click()
    except NoSuchElementException:
        print(f"❌ Chat '{chat_name}' not found.")
        driver.quit()
        exit(1)

last_message_id = ""

def get_message_id(text):
    return hashlib.md5(text.encode()).hexdigest()

def is_outgoing(element):
    try:
        parent = element
        for _ in range(10):
            parent = parent.find_element(By.XPATH, "..")
            class_attr = parent.get_attribute("class") or ""
            if "message-out" in class_attr:
                return True
            if "message-in" in class_attr:
                return False
        logging.warning("Reached top of DOM tree without finding message-in/out class.")
    except Exception as e:
        logging.error(f"[⚠️] Error determining message direction: {e}")
    return False

def is_relevant(message):
    for phrase in args.phrases:
        score = fuzz.partial_ratio(message, phrase)
        logging.debug(f"Comparing with '{phrase}' → Score: {score}")
        if score >= args.threshold:
            return True
    return False

def log_message(text, outgoing):
    endpoint = args.webhook + ("/m" if outgoing else "/ef")
    try:
        res = requests.post(endpoint, json={"data": text})
        logging.info(f"Logged {'my' if outgoing else 'incoming'} message: {text} (status {res.status_code})")
        if not outgoing and args.phrases and is_relevant(text):
            send_alert(text)
    except Exception as e:
        logging.error(f"Logging error: {e}")

def send_alert(text):
    try:
        res = requests.post(args.webhook + "/alert", json={"alert": text})
        logging.info(f"🔔 Alert sent for message: {text} (status {res.status_code})")
    except Exception as e:
        logging.error(f"Alert sending error: {e}")

def check_messages():
    global last_message_id
    elements = driver.find_elements(By.CSS_SELECTOR, "div.message-in span.selectable-text, div.message-out span.selectable-text")
    if not elements:
        return
    latest = elements[-1]
    text = latest.text.strip()
    msg_id = get_message_id(text)
    if msg_id != last_message_id:
        last_message_id = msg_id
        outgoing = is_outgoing(latest)
        print(f"\n[📥 {'ME' if outgoing else 'THEM'}] {text}")
        log_message(text, outgoing)

open_chat(args.chat)
print(f">>> Monitoring chat: {args.chat}")
if args.phrases:
    print(f">>> Alerting on phrases (min score {args.threshold}): {args.phrases}")

try:
    while True:
        check_messages()
        time.sleep(args.interval)
except KeyboardInterrupt:
    print("Exiting...")
    driver.quit() 