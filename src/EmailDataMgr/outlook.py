from applescript import asrun

def getOutlook():
    cmdTemplate = '''
    set theReturn to {}
    tell application "Microsoft Outlook"
        
        -- set allMessages to incoming messages
        
        -- get only the first 5 items of the sorted list
        
        set inboxFolder to folder "Inbox" of default account
        set allMessages to messages of inboxFolder
        
        set recentMessages to items 1 thru 40 of allMessages
        
        -- copy their subjects to theReturn
        
        repeat with thisMessage in recentMessages
            set thisObject to {subject:"", time:"", sender:""}
            copy subject of thisMessage to thisObject's subject
            copy sender of thisMessage to thisObject's sender
            copy time received of thisMessage to thisObject's time
            copy thisObject to end of theReturn
        end repeat
        
        return theReturn
        
    end tell
    '''

    # cmd = cmdTemplate.format(sys.argv[1])

    def ParseOutput(e):
        subjects = e.split("subject:")
        times = e.split("time:")
        senders = e.split("sender:name:")
        subArr = []
        dateArr = []
        sendArr = []
        finalObj = []
        for i in subjects:
            ret = i.split(", time:")[0]
            if(ret != ""):
                subArr.append(ret)
        for i in times:
            dateArr.append(i.split(", sender:name:")[0].replace("date ", "").split(" at ")[0])
        for i in senders:
            sendArr.append(i.split(", address:")[0])
        if(len(sendArr) == len(dateArr) == len(sendArr)):
            del sendArr[0]
            del dateArr[0]
            for i, item in enumerate(sendArr):
                finalObj.append({"title": subArr[i], "sender" :sendArr[i], "date": dateArr[i]})
            return finalObj
        else:
            return 0

    return ParseOutput(asrun(cmdTemplate))
