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
def handle_SIMPLE_F1(msg):
    print('handle_SIMPLE_F1: ' + str(msg["dataObject"]))
def handle_SIMPLE_F2(msg):
    print('handle_SIMPLE_F2: ' + str(msg["dataObject"]))
def handle_SIMPLE_F3(msg):
    print('handle_SIMPLE_F3: ' + str(msg["dataObject"]))
def handle_SIMPLE_F4(msg):
    print('handle_SIMPLE_F4: ' + str(msg["dataObject"]))
def handle_SIMPLE_F5(msg):
    print('handle_SIMPLE_F5: ' + str(msg["dataObject"]))
def handle_SIMPLE_F6(msg):
    print('handle_SIMPLE_F6: ' + str(msg["dataObject"]))
def handle_SIMPLE_F7(msg):
    print('handle_SIMPLE_F7: ' + str(msg["dataObject"]))
def handle_SIMPLE_F8(msg):
    print('handle_SIMPLE_F8: ' + str(msg["dataObject"]))
def handle_COMPLEX_F9(msg):
    print('handle_COMPLEX_F9: ' + str(msg["dataObject"]))
def handle_RESPONSE_FUNCTION_F10(msg):
    print('handle_RESPONSE_FUNCTION_F10: ' + str(msg["dataObject"]))
    # TODO: Send response events for - "RESPONSE_EVENT_E10"

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
        event='SIMPLE_E1',
        event_name='Simple Event E1',
        event_description='Event to send a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "string"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_E2',
        event_name='Simple Event E2',
        event_description='Event to send a message with a simple dataobject',
        event_dataformat=
        {
            "dataObject": {
                "type": "boolean"
            }
        },
        event_priority=0, # 0 (LOW), 1 (MEDIUM), 2 (HIGH)
    )
    myMsbClient.addEvent(
        event='SIMPLE_E3',
        event_name='Simple Event E3',
        event_description='Event to send a message with a simple dataobject',
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
        event='SIMPLE_E4',
        event_name='Simple Event E4',
        event_description='Event to send a message with a simple dataobject',
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
        event='SIMPLE_E5',
        event_name='Simple Event E5',
        event_description='Event to send a message with a simple dataobject',
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
        event='SIMPLE_E6',
        event_name='Simple Event E6',
        event_description='Event to send a message with a simple dataobject',
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
        event='SIMPLE_E7',
        event_name='Simple Event E7',
        event_description='Event to send a message with a simple dataobject',
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
        event='SIMPLE_E8',
        event_name='Simple Event E8',
        event_description='Event to send a message with a simple dataobject',
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
        event='COMPLEX_E9',
        event_name='Complex Event E9',
        event_description='Description for Complex Event E9',
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
        event='RESPONSE_EVENT_E10',
        event_name='Response Event Sample E10',
        event_description='Event to send another message as response event E10',
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
        function='SIMPLE_F1',
        function_name='Simple Function F1',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string"
            }
        },
        fnpointer=handle_SIMPLE_F1,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F2',
        function_name='Simple Function F2',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "boolean"
            }
        },
        fnpointer=handle_SIMPLE_F2,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F3',
        function_name='Simple Function F3',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int32"
            }
        },
        fnpointer=handle_SIMPLE_F3,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F4',
        function_name='Simple Function F4',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "integer",
                "format": "int64"
            }
        },
        fnpointer=handle_SIMPLE_F4,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F5',
        function_name='Simple Function F5',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "float"
            }
        },
        fnpointer=handle_SIMPLE_F5,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F6',
        function_name='Simple Function F6',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "number",
                "format": "double"
            }
        },
        fnpointer=handle_SIMPLE_F6,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F7',
        function_name='Simple Function F7',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "byte"
            }
        },
        fnpointer=handle_SIMPLE_F7,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='SIMPLE_F8',
        function_name='Simple Function F8',
        function_description='Function to hanlde a message with a simple dataobject',
        function_dataformat=
        {
            "dataObject": {
                "type": "string",
                "format": "date-time"
            }
        },
        fnpointer=handle_SIMPLE_F8,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='COMPLEX_F9',
        function_name='Complex Function F9',
        function_description='Description for Complex Function F9',
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
        fnpointer=handle_COMPLEX_F9,
        responseEvents=[],
    )
    myMsbClient.addFunction(
        function='RESPONSE_FUNCTION_F10',
        function_name='Function With Response Event Sample F10',
        function_description='Function to handle handle message and send a response event',
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
        fnpointer=handle_RESPONSE_FUNCTION_F10,
        responseEvents=["RESPONSE_EVENT_E10"],
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