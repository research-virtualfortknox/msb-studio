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
<% if (params) { -%>
<%   params.forEach(function(param){ -%>
<%-    "myMsbClient.addConfigParameter(" -%>
<%-      "'" + param.key + "', " -%>
<%-      (param.type.toLowerCase() === 'string' ? "'" + param.value + "'" : param.value) + ", "  -%>
<%-      "'" + (param.format ? param.format : param.type) + "'" -%>
<%-    ")" -%>
<%-  %>
<%   }) -%>
<% } -%>

// add events
<% if (events) { -%>
<%   events.forEach(function(event){ -%>
<%-      "myMsbClient.addEvent({" %>
<%-        "  eventId: '" + event.eventId + "'," %>
<%-        "  name: '" + event.name + "'," %>
<%-        "  description: '" + event.description + "'," %>
<%-        "  dataFormat:" + '\n' + JSON.stringify(event.dataFormat, null, 2).replace(/^(?=.)/gm, ' '.repeat(2)) + "," %>
<%-        "  implementation: {\n    priority: 0, //// 0 (LOW), 1 (MEDIUM), 2 (HIGH)\n  }," %>
<%-      "})" -%>
<%-  %>
<%   }) -%>
<% } -%>

// add functions
<% if (functions) { -%>
<%   functions.forEach(function(func){ -%>
<%-      "myMsbClient.addFunction({" %>
<%-        "  functionId: '" + func.functionId + "'," %>
<%-        "  name: '" + func.name + "'," %>
<%-        "  description: '" + func.description + "'," %>
<%-        "  dataFormat:" + '\n' + JSON.stringify(func.dataFormat, null, 2).replace(/^(?=.)/gm, ' '.repeat(2)) + "," %>
<%-        "  implementation: " + 'handle_' + func.functionId + "," %>
<%-        "  responseEvents: [" + (func.responseEventsString ? func.responseEventsString : "") + "]" %>
<%-      "})" -%>
<%-  %>
<%   }) -%>
<% } -%>

// function implementations
<% if (functions) { -%>
<%   functions.forEach(function(func){ -%>
<%-      "function handle_" + func.functionId + "(msg) {" %>
<%-        "  console.info('handle_" + func.functionId + ": ' + JSON.stringify(msg));" %>
<%         if (func.responseEventsString) { -%>
<%-          "  // TODO: Send response events for - " + func.responseEventsString %>
<%         } -%>
<%-      "}" -%>
<%-  %>
<%   }) -%>
<% } -%>

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
