from CanvDataGrabber import GetNewCanvData
from CanvDataUpdater import TimeDrop, UsrOverride
from fastapi import FastAPI, Response
import json
import pandas as pd



# run with -   uvicorn main:app --reload    - 

# 0 - success
# 1 - cannot start webdriver
# 2 - Error with navigating to assignments
# 3 - Error with compiling data and appending to dataframe

picklePath = './CanvasData.pkl'

app = FastAPI()

@app.get("/canvdata")
def giveData(response: Response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  return json.loads(pd.read_pickle(picklePath).to_json(orient='records'))

@app.get("/refreshdata")
def refData(response: Response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  res = GetNewCanvData()
  return res
# retCode = GetNewCanvData()
# if(retCode != 0):
#     print('Error with getting new data. Code: ' + retCode)
# else:
#     TimeDrop()