import datetime
import threading
import uuid
import time

from msb_client.ComplexDataFormat import ComplexDataFormat
from msb_client.DataType import DataType
from msb_client.Event import Event
from msb_client.Function import Function
from msb_client.MsbClient import MsbClient

# the msb client
global myMsbClient

# function implementations
<% if (functions) { -%>
<%   functions.forEach(function(func){ -%>
<%-      "def handle_" + func.functionId + "(msg):" %>
<%-        "    print('handle_" + func.functionId + ": ' + str(msg[\"dataObject\"]))" -%>
<%         if (func.responseEventsString) { -%>
<%-          "\n    # TODO: Send response events for - " + func.responseEventsString -%>
<%         } -%>
<%-  %>
<%   }) -%>
<% } -%>

def setupMsbClient():

    # change the msb client settings
    myMsbClient.enableDebug(True)
    myMsbClient.disableHostnameVerification(True)
    myMsbClient.enableDataFormatValidation(True)

    # add configuration parameters
<% if (params) { -%>
<%   params.forEach(function(param){ -%>
<%-    "    myMsbClient.addConfigParameter(" -%>
<%-      '"' + param.key + '", ' -%>
<%     if (param.type.toLowerCase() == 'string') { -%>
<%-      '"' + param.value + '"' + ", " -%>
<%     } else if (param.type.toLowerCase() == 'boolean') { -%>
<%-      (param.value.toString().charAt(0).toUpperCase() + param.value.toString().slice(1)) + ", " -%>
<%     } else { -%>
<%-      param.value + ", " -%>
<%     } -%>
<%     if ((param.format ? param.format : param.type).toLowerCase() == 'date-time') { -%>
<%-      'DataType.DATETIME' -%>
<%     } else { -%>
<%-      'DataType.' + (param.format ? param.format : param.type).toUpperCase() -%>
<%     } -%>
<%-    ")" -%>
<%-  %>
<%   }) -%>
<% } -%>

    # add events
<% if (events) { -%>
<%   events.forEach(function(event){ -%>
<%-      "    myMsbClient.addEvent(" %>
<%-        "        event='" + event.eventId + "'," %>
<%-        "        event_name='" + event.name + "'," %>
<%-        "        event_description='" + event.description + "'," %>
<%-        "        event_dataformat=" + '\n' + JSON.stringify(event.dataFormat, null, 4).replace(/^(?=.)/gm, ' '.repeat(8)) + "," %>
<%-        "        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)" %>
<%-      "    )" -%>
<%-  %>
<%   }) -%>
<% } -%>

    # add functions
<% if (functions) { -%>
<%   functions.forEach(function(func){ -%>
<%-      "    myMsbClient.addFunction(" %>
<%-        "        function='" + func.functionId + "'," %>
<%-        "        function_name='" + func.name + "'," %>
<%-        "        function_description='" + func.description + "'," %>
<%-        "        function_dataformat=" + '\n' + JSON.stringify(func.dataFormat, null, 4).replace(/^(?=.)/gm, ' '.repeat(8)) + "," %>
<%-        "        fnpointer=" + 'handle_' + func.functionId + "," %>
<%-        "        responseEvents=[" + (func.responseEventsString ? func.responseEventsString : "") + "]," %>
<%-      "    )" -%>
<%-  %>
<%   }) -%>
<% } -%>

    # print self-description of your client
    print(myMsbClient.objectToJson(myMsbClient.getSelfDescription()))

# connect and register the client
def runMsbClient():
    
    # connect to msb url defined in applications.properties
    # if required, add a loop (with timeout) to wait for myMsbClient.connected and myMsbClient.registered
    myMsbClient.connect()
    myMsbClient.register()

def sendData():
    while True:
        # add your test events here
        #myMsbClient.publish(
        #    eventId="EVENT_ID", # event id
        #    dataObject="Hello World!", # event value (or object)
        #    priority=0, # event priority
        #)
        # wait 5 seconds
        time.sleep(5)

if __name__ == "__main__":

    # initialize msb client (application.properties used for client params)
    myMsbClient = MsbClient()

    # setup msb client
    setupMsbClient()
    # run msb client in a thread
    msbClientThread = threading.Thread(target=runMsbClient, args=())
    msbClientThread.start()

    # send events in a thread (every 5 seconds to tests them)
    sendDataThread = threading.Thread(target=sendData, args=())
    sendDataThread.start()