'use strict'

// imports
const MsbClient = require('@vfk_research/msb-client-websocket-nodejs')

// initialize msb client (application.properties used for client params)
var myMsbClient = new MsbClient()

// change the msb client settings
myMsbClient.enableDebug(true)
myMsbClient.disableHostnameVerification(true)
myMsbClient.enableDataFormatValidation(true)

// add configuration parameters
myMsbClient.addConfigParameter('confParam1', 'StringValue', 'string')
myMsbClient.addConfigParameter('confParam2', true, 'boolean')
myMsbClient.addConfigParameter('confParam3', 1000, 'int32')
myMsbClient.addConfigParameter('confParam4', 8000, 'int64')
myMsbClient.addConfigParameter('confParam5', 1.3, 'float')
myMsbClient.addConfigParameter('confParam6', 3.3, 'double')
myMsbClient.addConfigParameter('confParam7', 'byte-string', 'byte')
myMsbClient.addConfigParameter('confParam8', '2019-07-23 11:07:00.938401', 'date-time')

// add events
myMsbClient.addEvent({
  eventId: 'SIMPLE_E1',
  name: 'Simple Event E1',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E2',
  name: 'Simple Event E2',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "boolean"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E3',
  name: 'Simple Event E3',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "integer",
      "format": "int32"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E4',
  name: 'Simple Event E4',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "integer",
      "format": "int64"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E5',
  name: 'Simple Event E5',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "number",
      "format": "float"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E6',
  name: 'Simple Event E6',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "number",
      "format": "double"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E7',
  name: 'Simple Event E7',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string",
      "format": "byte"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'SIMPLE_E8',
  name: 'Simple Event E8',
  description: 'Event to send a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string",
      "format": "date-time"
    }
  },
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'COMPLEX_E9',
  name: 'Complex Event E9',
  description: 'Description for Complex Event E9',
  dataFormat:
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
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})
myMsbClient.addEvent({
  eventId: 'RESPONSE_EVENT_E10',
  name: 'Response Event Sample E10',
  description: 'Event to send another message as response event E10',
  dataFormat:
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
  implementation: {
    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)
  },
})

// add functions
myMsbClient.addFunction({
  functionId: 'SIMPLE_F1',
  name: 'Simple Function F1',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string"
    }
  },
  implementation: handle_SIMPLE_F1,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F2',
  name: 'Simple Function F2',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "boolean"
    }
  },
  implementation: handle_SIMPLE_F2,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F3',
  name: 'Simple Function F3',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "integer",
      "format": "int32"
    }
  },
  implementation: handle_SIMPLE_F3,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F4',
  name: 'Simple Function F4',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "integer",
      "format": "int64"
    }
  },
  implementation: handle_SIMPLE_F4,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F5',
  name: 'Simple Function F5',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "number",
      "format": "float"
    }
  },
  implementation: handle_SIMPLE_F5,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F6',
  name: 'Simple Function F6',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "number",
      "format": "double"
    }
  },
  implementation: handle_SIMPLE_F6,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F7',
  name: 'Simple Function F7',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string",
      "format": "byte"
    }
  },
  implementation: handle_SIMPLE_F7,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'SIMPLE_F8',
  name: 'Simple Function F8',
  description: 'Function to hanlde a message with a simple dataobject',
  dataFormat:
  {
    "dataObject": {
      "type": "string",
      "format": "date-time"
    }
  },
  implementation: handle_SIMPLE_F8,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'COMPLEX_F9',
  name: 'Complex Function F9',
  description: 'Description for Complex Function F9',
  dataFormat:
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
  implementation: handle_COMPLEX_F9,
  responseEvents: []
})
myMsbClient.addFunction({
  functionId: 'RESPONSE_FUNCTION_F10',
  name: 'Function With Response Event Sample F10',
  description: 'Function to handle handle message and send a response event',
  dataFormat:
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
  implementation: handle_RESPONSE_FUNCTION_F10,
  responseEvents: ["RESPONSE_EVENT_E10"]
})

// function implementations
function handle_SIMPLE_F1(msg) {
  console.info('handle_SIMPLE_F1: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F2(msg) {
  console.info('handle_SIMPLE_F2: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F3(msg) {
  console.info('handle_SIMPLE_F3: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F4(msg) {
  console.info('handle_SIMPLE_F4: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F5(msg) {
  console.info('handle_SIMPLE_F5: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F6(msg) {
  console.info('handle_SIMPLE_F6: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F7(msg) {
  console.info('handle_SIMPLE_F7: ' + JSON.stringify(msg));
}
function handle_SIMPLE_F8(msg) {
  console.info('handle_SIMPLE_F8: ' + JSON.stringify(msg));
}
function handle_COMPLEX_F9(msg) {
  console.info('handle_COMPLEX_F9: ' + JSON.stringify(msg));
}
function handle_RESPONSE_FUNCTION_F10(msg) {
  console.info('handle_RESPONSE_FUNCTION_F10: ' + JSON.stringify(msg));
  // TODO: Send response events for - "RESPONSE_EVENT_E10"
}

// print self-description of your client
console.info(JSON.stringify(myMsbClient.getSelfDescription(), null, 2))

// connect to msb url defined in applications.properties
myMsbClient.connect()
myMsbClient.register()

// send events every 5 seconds to tests them
setTimeout(function () {
  setInterval(sendData, 5000)
}, 3000)

// sample how to send events
function sendData () {

  // add your test events here
  /*
  myMsbClient.publish(
    'EVENT_ID', // event id
    "Hello World!", // event vlaue
    0, // event priority
    true // should the event be cached if the client is disconnected
  )
  */
}
