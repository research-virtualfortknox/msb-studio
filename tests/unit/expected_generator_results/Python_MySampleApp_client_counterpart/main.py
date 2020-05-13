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
def handle_SIMPLE_E1_FUNCTION(msg):
    print('handle_SIMPLE_E1_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E2_FUNCTION(msg):
    print('handle_SIMPLE_E2_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E3_FUNCTION(msg):
    print('handle_SIMPLE_E3_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E4_FUNCTION(msg):
    print('handle_SIMPLE_E4_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E5_FUNCTION(msg):
    print('handle_SIMPLE_E5_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E6_FUNCTION(msg):
    print('handle_SIMPLE_E6_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E7_FUNCTION(msg):
    print('handle_SIMPLE_E7_FUNCTION: ' + str(msg["dataObject"]))
def handle_SIMPLE_E8_FUNCTION(msg):
    print('handle_SIMPLE_E8_FUNCTION: ' + str(msg["dataObject"]))
def handle_COMPLEX_E9_FUNCTION(msg):
    print('handle_COMPLEX_E9_FUNCTION: ' + str(msg["dataObject"]))
def handle_RESPONSE_EVENT_E10_FUNCTION(msg):
    print('handle_RESPONSE_EVENT_E10_FUNCTION: ' + str(msg["dataObject"]))

def setupMsbClient():

    # change the msb client settings
    myMsbClient.enableDebug(True)
    myMsbClient.disableHostnameVerification(True)
    myMsbClient.enableDataFormatValidation(True)

    # add configuration parameters
    myMsbClient.addConfigParameter("confParam1", "StringValue", DataType.STRING)
    myMsbClient.addConfigParameter("confParam2", True, DataType.BOOLEAN)
    myMsbClient.addConfigParameter("confParam3", 1000, DataType.INT32)
    myMsbClient.addConfigParameter("confParam4", 8000, DataType.INT64)
    myMsbClient.addConfigParameter("confParam5", 1.3, DataType.FLOAT)
    myMsbClient.addConfigParameter("confParam6", 3.3, DataType.DOUBLE)
    myMsbClient.addConfigParameter("confParam7", "byte-string", DataType.BYTE)
    myMsbClient.addConfigParameter("confParam8", "2019-07-23 11:07:00.938401", DataType.DATETIME)

    # add events
    myMsbClient.addEvent(
        event='SIMPLE_F1_EVENT',
        event_name='Simple Function F1',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "string"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F2_EVENT',
        event_name='Simple Function F2',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "boolean"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F3_EVENT',
        event_name='Simple Function F3',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int32"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F4_EVENT',
        event_name='Simple Function F4',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int64"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F5_EVENT',
        event_name='Simple Function F5',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "float"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F6_EVENT',
        event_name='Simple Function F6',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "double"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F7_EVENT',
        event_name='Simple Function F7',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "byte"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_F8_EVENT',
        event_name='Simple Function F8',
        event_description='Function to hanlde a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "date-time"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='COMPLEX_F9_EVENT',
        event_name='Complex Function F9',
        event_description='Description for Complex Function F9',
        event_dataformat=
        {
            "dataObject": {
                "$ref": "#/definitions/MyDevice"
            },
            "MyDevice": {
                "type": "object",
                "properties": {
                    "deviceName": {
                        "type": "string"
                    },
                    "deviceWeight": {
                        "type": "number",
                        "format": "float"
                    },
                    "submodules": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/MyModule"
                        }
                    }
                }
            },
            "MyModule": {
                "type": "object",
                "properties": {
                    "moduleName": {
                        "type": "string"
                    }
                }
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='RESPONSE_FUNCTION_F10_EVENT',
        event_name='Function With Response Event Sample F10',
        event_description='Function to handle handle message and send a response event',
        event_dataformat=
        {
            "dataObject": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )

    # add functions
    myMsbClient.addFunction(
        function='SIMPLE_E1_FUNCTION',
        function_name='Simple Event E1',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string"
            }
        },
        fnpointer=handle_SIMPLE_E1_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E2_FUNCTION',
        function_name='Simple Event E2',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "boolean"
            }
        },
        fnpointer=handle_SIMPLE_E2_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E3_FUNCTION',
        function_name='Simple Event E3',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int32"
            }
        },
        fnpointer=handle_SIMPLE_E3_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E4_FUNCTION',
        function_name='Simple Event E4',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int64"
            }
        },
        fnpointer=handle_SIMPLE_E4_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E5_FUNCTION',
        function_name='Simple Event E5',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "float"
            }
        },
        fnpointer=handle_SIMPLE_E5_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E6_FUNCTION',
        function_name='Simple Event E6',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "double"
            }
        },
        fnpointer=handle_SIMPLE_E6_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E7_FUNCTION',
        function_name='Simple Event E7',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "byte"
            }
        },
        fnpointer=handle_SIMPLE_E7_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_E8_FUNCTION',
        function_name='Simple Event E8',
        function_description='Event to send a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "date-time"
            }
        },
        fnpointer=handle_SIMPLE_E8_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='COMPLEX_E9_FUNCTION',
        function_name='Complex Event E9',
        function_description='Description for Complex Event E9',
        function_dataformat=
        {
            "dataObject": {
                "$ref": "#/definitions/MyDevice"
            },
            "MyDevice": {
                "type": "object",
                "properties": {
                    "deviceName": {
                        "type": "string"
                    },
                    "deviceWeight": {
                        "type": "number",
                        "format": "float"
                    },
                    "submodules": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/MyModule"
                        }
                    }
                }
            },
            "MyModule": {
                "type": "object",
                "properties": {
                    "moduleName": {
                        "type": "string"
                    }
                }
            }
        },
        fnpointer=handle_COMPLEX_E9_FUNCTION,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='RESPONSE_EVENT_E10_FUNCTION',
        function_name='Response Event Sample E10',
        function_description='Event to send another message as response event E10',
        function_dataformat=
        {
            "dataObject": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    }
                }
            }
        },
        fnpointer=handle_RESPONSE_EVENT_E10_FUNCTION,
        responseEvents=[],
    )

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