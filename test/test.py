from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

PATH = "D:\ProgramSupport\chromedriver.exe"
driver = webdriver.Chrome(PATH)

driver.get("http://localhost:3000/")
driver.switch_to.new_window('tab')

driver.get("http://localhost:3000/")


input()