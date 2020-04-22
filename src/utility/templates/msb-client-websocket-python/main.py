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
<%     if ((func.functionId ? func.functionId : func.eventId) !== 'CONNECTED' && (func.functionId ? func.functionId : func.eventId) !== 'UNCONNECTED'){  -%>
<%-      "def handle_" + (func.functionId ? func.functionId : func.eventId + '_FUNCTION') + "(msg):" %>
<%-        "    print('handle_" + (func.functionId ? func.functionId : func.eventId + '_FUNCTION') + ": ' + str(msg[\"dataObject\"]))" -%>
<%         if (func.responseEventsString) { -%>
<%-          "\n    # TODO: Send response events for - " + func.responseEventsString -%>
<%         } -%>
<%-  %>
<%     } -%>
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
<%     if (event.eventId !== 'CONNECTED' && event.eventId !== 'UNCONNECTED'){  -%>
<%-      "    myMsbClient.addEvent(" %>
<%-        "        event='" + (event.eventId ? event.eventId : event.functionId + '_EVENT') + "'," %>
<%-        "        event_name='" + event.name + "'," %>
<%-        "        event_description='" + event.description + "'," %>
<%-        "        event_dataformat=" + '\n' + JSON.stringify(event.dataFormat, null, 4).replace(/^(?=.)/gm, ' '.repeat(8)) + "," %>
<%-        "        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)" %>
<%-      "    )" -%>
<%-  %>
<%     } -%>
<%   }) -%>
<% } -%>

    # add functions
<% if (functions) { -%>
<%   functions.forEach(function(func){ -%>
<%     if ((func.functionId ? func.functionId : func.eventId) !== 'CONNECTED' && (func.functionId ? func.functionId : func.eventId) !== 'UNCONNECTED'){  -%>
<%-      "    myMsbClient.addFunction(" %>
<%-        "        function='" + (func.functionId ? func.functionId : func.eventId + '_FUNCTION') + "'," %>
<%-        "        function_name='" + func.name + "'," %>
<%-        "        function_description='" + func.description + "'," %>
<%-        "        function_dataformat=" + '\n' + JSON.stringify(func.dataFormat, null, 4).replace(/^(?=.)/gm, ' '.repeat(8)) + "," %>
<%-        "        fnpointer=" + 'handle_' + (func.functionId ? func.functionId : func.eventId + '_FUNCTION') + "," %>
<%-        "        responseEvents=[" + (func.responseEventsString ? func.responseEventsString : "") + "]," %>
<%-      "    )" -%>
<%-  %>
<%     } -%>
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