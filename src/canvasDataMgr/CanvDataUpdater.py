import pandas as pd
import datetime 

# picklePath = './src/canvasDataMgr/CanvasData.pkl'
picklePath = './CanvasData.pkl'
format_string = "%Y-%m-%dT%H:%M:%SZ"
twodaytime = 172800000

# df = pd.read_pickle(picklePath)
# df = pd.read_pickle(picklePath)
# print(df.index)
# df.to_csv('data.csv')
# df.to_pickle(picklePath)

def TimeDrop():
    # remove assignments that are more than 1 week old
    df = pd.read_pickle(picklePath)
    curr = int(datetime.datetime.now().timestamp() * 1000)
    df = df[df['DueDate'] >= (curr - twodaytime)]
    df.to_csv('data.csv')
    df.to_pickle(picklePath)

def UsrOverride(id):
    # sets displaying an assignment or not based on user
    df = pd.read_pickle(picklePath)
    if(df.at[id, "UserOverride"] == None):
        df.at[id, 'UserOverride'] = True
    else:
        df.at[id, 'UserOverride'] = None
    df.to_pickle(picklePath)