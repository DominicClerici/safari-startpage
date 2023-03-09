import json
from seleniumwire import webdriver
import os 
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from seleniumwire.utils import decode
from CanvDataUpdater import TimeDrop
import time
import datetime 
import pandas as pd
from password.info import username, password

# picklePath = './src/canvasDataMgr/CanvasData.pkl'
# cookiePath = './src/canvasDataMgr/CanvasCookies.pkl'
picklePath = './CanvasData.pkl'
cookiePath = './CanvasCookies.pkl'

def GetNewCanvData():
    chrome_options = Options()
    chrome_options.add_argument("user-data-dir=selenium")
    chrome_options.add_argument("--headless=new")

    caps = DesiredCapabilities.CHROME
    caps['goog:loggingPrefs'] = {'performance': 'ALL'}
    try:
        driver = webdriver.Chrome(desired_capabilities=caps, options=chrome_options)
    except:
        driver.close()
        return 1
    # cookies = pickle.load(open(cookiePath, "rb"))
    # for cookie in cookies:
    #     driver.add_cookie(cookie)
    try:
        driver.get('https://iu.instructure.com')
        wait2 = WebDriverWait(driver, 60)
        wait2.until(EC.element_to_be_clickable((By.ID, "username"))).send_keys(username)
        inp2 = driver.find_element(By.ID, 'password')
        inp2.send_keys(password)
        btn = driver.find_element(By.ID, "login-button")
        btn.click()
        print('waiting on duo')
        try:
            wait = WebDriverWait(driver,15)
            wait.until(EC.presence_of_element_located((By.XPATH, ".//h1[text()='Check for a Duo Push']")))
        except:
            print('continuing')
        else:
            print('approve duo push')
            wait = WebDriverWait(driver, 15)
            wait.until(EC.element_to_be_clickable((By.ID, "trust-browser-button"))).click()
        wait3 = WebDriverWait(driver, 30)
        wait3.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".Grouping-styles__root.planner-grouping")))
        driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        wait4 = WebDriverWait(driver, 30)
        wait4.until(EC.element_to_be_clickable((By.XPATH, ".//button[text()='Load more']"))).click()
    except:
        driver.close()
        return 2
    time.sleep(5)

    print('webdriver success')
    try:
        classList = ["2121573", "2115470", "2118316", "2119883", "2124225", "2143487"]
        df = pd.read_pickle(picklePath)
        format_string = "%Y-%m-%dT%H:%M:%SZ"

        def findClass(e):
            match e:
                case "2118316":
                    return "Econ"
                case "2121573":
                    return "Calc"
                case "2115174":
                    return "Accounting"
                case "2115470":
                    return "Business Presentations"
                case "2119883":
                    return "Human Geography"
                case "2124225":
                    return "Music for the Listener"
                case "2143487":
                    return "Yoga"

        for request in driver.requests:
            if request.response:
                if request.url.startswith('https://iu.instructure.com/api/v1/planner/items'):
                    body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                    y = json.loads(body)
                    amt = 0
                    for x in y:
                        if  x['course_id'] not in classList:
                            pass
                        else:
                            # updating current rec
                            if x['plannable_id'] in df.index:
                                if x['submissions'] == False:
                                    dt = int(datetime.datetime.strptime(x["plannable_date"], format_string).timestamp() * 1000)
                                    classtoApp = findClass(x['course_id'])
                                    tempData = [x['plannable_id'], dt, "A", None, None, classtoApp, x["plannable"]['title'], x['html_url'], df.loc[x['plannable_id']].UserOverride] 
                                    df.loc[x['plannable_id']] = tempData
                                else:
                                    dt = int(datetime.datetime.strptime(x["plannable_date"], format_string).timestamp() * 1000)
                                    classtoApp = findClass(x['course_id'])
                                    tempData = [x['plannable_id'], dt, "T", x['plannable']['points_possible'], x['submissions']['submitted'], classtoApp, x["plannable"]['title'], x['html_url'], df.loc[x['plannable_id']].UserOverride] 
                                    df.loc[x['plannable_id']] = tempData
                            # adding new rec
                            else:
                                if x['submissions'] == False:
                                    dt = int(datetime.datetime.strptime(x["plannable_date"], format_string).timestamp() * 1000)
                                    classtoApp = findClass(x['course_id'])
                                    tempData = [x['plannable_id'], dt, "A", None, None, classtoApp, x["plannable"]['title'], x['html_url'], None] 
                                    df.loc[x['plannable_id']] = tempData
                                else:
                                    dt = int(datetime.datetime.strptime(x["plannable_date"], format_string).timestamp() * 1000)
                                    classtoApp = findClass(x['course_id'])
                                    tempData = [x['plannable_id'], dt, "T", x['plannable']['points_possible'], x['submissions']['submitted'], classtoApp, x["plannable"]['title'], x['html_url'], None] 
                                    df.loc[x['plannable_id']] = tempData
        df.to_pickle(picklePath)
    except:
        driver.close()
        return 3
    TimeDrop()
    driver.close()
    return 0