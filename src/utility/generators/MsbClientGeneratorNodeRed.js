'use strict'

import MsbClientGenerator from './MsbClientGenerator'
// eslint-disable-next-line import/no-webpack-loader-syntax
import flowJsonFileContent from '!!raw-loader!../templates/msb-client-websocket-nodered/msb-client-flow.json.raw'
// eslint-disable-next-line import/no-webpack-loader-syntax
import readmeFileContent from '!!raw-loader!../templates/msb-client-websocket-nodered/README.md'
import MsbSelfDescriptionUtil from '../MsbSelfDescriptionUtil'
import { isUnparsedTextLike } from 'typescript'

// Template Enginge
let ejs = require('ejs')

const uuidv4 = require('uuid/v4')

// start and end pattern for placeholders
const START_DELIMITER = '{{-- '
const END_DELIMITER = ' --}}'

/**
 * Generator to update your app template files
 * with all parts of a self description (settings, params, events, functions)
 */
export default class MsbClientGeneratorNodeRed extends MsbClientGenerator {
  constructor (generateCounterpart = false, msbSelfDescriptionUtil) {
    // setup all files from the teamplte here
    var fileSet = [
      {
        fileName: 'msb-client-flow.json',
        content: flowJsonFileContent,
        targetPath: '',
        format: 'json'
      },
      {
        fileName: 'README.md',
        content: readmeFileContent,
        targetPath: '',
        format: 'md'
      }
    ]
    super(generateCounterpart, fileSet, msbSelfDescriptionUtil)
  }

  /**
   * Setter to activate the generation of a counterpart service
   * @param {boolean} generateCounterpart
   */
  setGenerateCounterpart (generateCounterpart = true) {
    super.setGenerateCounterpart(generateCounterpart)
  }

  /**
   * Get the file set
   */
  getFileSet () {
    return super.getFileSet()
  }

  /**
   * Execute the code generation
   * @param {MsbSelfDescriptionUtil} msbSelfDescriptionUtil
   */
  generateCode (msbSelfDescriptionUtil) {
    var generateCounterpart = super.getGenerateCounterpart()
    var settings = msbSelfDescriptionUtil.getSettings()
    var params = msbSelfDescriptionUtil.getConfigurationParamsAsArray()
    var events = msbSelfDescriptionUtil.getEvents()
    var functions = msbSelfDescriptionUtil.getFunctions()
    
    events = this.removeEventsWithMsbConnectionStates(events)
    var eventsForTransformation = events
    var functionsForTransformation = functions
    if (generateCounterpart) {
      settings = this.updateSettingsForCounterpart(settings)
      events = this.transformFunctionsToEvents(functionsForTransformation)
      functions = this.transformEventsToFunctions(eventsForTransformation)
    } else {
      functions = this.addFunctionResponseEventsString(functions)
    }

    // generate the flow json file
    this.generateMainFile(
      settings,
      params,
      events,
      functions
    )
  }

  /**
   * Add configuration params, events and functions to the main file
   * @param {[ConfigurationParameter]} params
   * @param {[Event]} events
   * @param {[Function]} functions
   */
  generateMainFile (settings, params, events, functions) {
    var file = this.getFileByName('msb-client-flow.json')
    let template = ejs.compile(file.content)

    settings.msbObjectNodeId = uuidv4()
    settings.debugNodeId = uuidv4()

    // TODO: Support complex objects in events an functions
    // remove complex events
    events = this.removeEventsOrFunctionsWithComplexObjects(events)
    // remove complex functions
    functions = this.removeEventsOrFunctionsWithComplexObjects(functions)

    // TODO: Support no payload in events an functions
    // fix events with no payload
    events = this.fixDataFormatWithNoPayload(events)
    // fix functions with no payload
    functions = this.fixDataFormatWithNoPayload(functions)

    // TODO: Support date-time in params, events an functions
    // fix config params with "date-time" instead of "datetime"
    params = this.fixConfigParamDataFormatWithTypeDateTime(params)
    // fix events with "date-time" instead of "datetime"
    events = this.fixEventOrFunctionDataFormatWithTypeDateTime(events)
    // fix functions with "date-time" instead of "datetime"
    functions = this.fixEventOrFunctionDataFormatWithTypeDateTime(functions)

    // add node red nodeId to events
    events = this.addNodeRedNodeIds(events)
    // add node red nodeId to events
    functions = this.addNodeRedNodeIds(functions)

    var templateData = {
      settings: settings,
      params: params,
      events: events,
      functions: functions
    }
    file.content = template(templateData)
    this.updateFile(file)
  }

  /**
   * Sets the dataFormat to string, if no payload is set in selfdesc
   * @param {eventsOrFunctions} eventsOrFunctions
   * @returns {eventsOrFunctions} eventsOrFunctions with updated dataFormats
   */
  fixDataFormatWithNoPayload (eventsOrFunctions) {
    if (eventsOrFunctions) {
      eventsOrFunctions.forEach(function (eventOrFunction, index, theArray) {
        if (!eventOrFunction.dataFormat.dataObject) {
          eventOrFunction.dataFormat.dataObject = {}
          eventOrFunction.dataFormat.dataObject.type = 'string'
          theArray[index] = eventOrFunction
        }
      })
    }
    return eventsOrFunctions
  }

  /**
   * Sets the dataFormat type of events or functions to "datetime", if specified as "date-time"
   * @param {eventsOrFunctions} eventsOrFunctions
   * @returns {eventsOrFunctions} eventsOrFunctions with updated dataFormats
   */
  fixEventOrFunctionDataFormatWithTypeDateTime (eventsOrFunctions) {
    if (eventsOrFunctions) {
      eventsOrFunctions.forEach(function (eventOrFunction, index, theArray) {
        if (
          eventOrFunction.dataFormat.dataObject
          && eventOrFunction.dataFormat.dataObject.hasOwnProperty('format')
          && eventOrFunction.dataFormat.dataObject.format === 'date-time' 
        ) {
          eventOrFunction.dataFormat.dataObject.format = 'datetime'
          theArray[index] = eventOrFunction
        }
      })
    }
    return eventsOrFunctions
  }

  /**
   * Sets the dataFormat type of config params to "datetime", if specified as "date-time"
   * @param {eventsOrFunctions} eventsOrFunctions
   * @returns {eventsOrFunctions} eventsOrFunctions with updated dataFormats
   */
  fixConfigParamDataFormatWithTypeDateTime (configParams) {
    if (configParams) {
      configParams.forEach(function (configParam, index, theArray) {
        if (
          configParam.hasOwnProperty('format')
          && configParam.format === 'date-time' 
        ) {
          configParam.format = 'datetime'
          theArray[index] = configParam
        }
      })
    }
    return configParams
  }

  /**
   * Add node red ids to the events and functions in case they need to be wired
   * @param {eventsOrFunctions} eventsOrFunctions
   * @returns {eventsOrFunctions} eventsOrFunctions with updated node red ids
   */
  addNodeRedNodeIds (eventsOrFunctions) {
    if (eventsOrFunctions) {
      eventsOrFunctions.forEach(function (eventOrFunction, index, theArray) {
        eventOrFunction.nodeId = uuidv4()
        theArray[index] = eventOrFunction
      })
    }
    return eventsOrFunctions
  }

  /**
   * Update msb client basic settings (uuid, name, token) for counterpart generation
   * @param {settings} settings
   * @returns {settings} settings
   */
  updateSettingsForCounterpart (settings) {
    return super.updateSettingsForCounterpart(settings)
  }

  /**
   * Remove all events with msb connection states ("CONNECTED", "UNCONNECTED")
   * @param {events} List of events
   * @returns {events} events withoud msb connection states
   */
  removeEventsWithMsbConnectionStates (events) {
    return super.removeEventsWithMsbConnectionStates(events)
  }

  /**
   * Transform a list of events into a list of functions
   * @param {events} events
   * @returns {functions} functions
   */
  transformEventsToFunctions (events) {
    return super.transformEventsToFunctions(events)
  }

  /**
   * Transform a list of functions into a list of events
   * @param {functions} functions
   * @returns {events} events
   */
  transformFunctionsToEvents (functions) {
    return super.transformFunctionsToEvents(functions)
  }

  /**
   * Remove all events or functions with a complex object in dataFormat
   * @param {eventsOrFunctions} List of events or functions
   * @returns {eventsOrFunctions} eventsOrFunctions
   */
  removeEventsOrFunctionsWithComplexObjects (eventsOrFunctions) {
    return super.removeEventsOrFunctionsWithComplexObjects(eventsOrFunctions)
  }

  /**
   * Add a string representing the response events to be added to the add function
   * @param {functions} functions
   * @returns {functions} functions with functions objects including a responseEventsString param
   */
  addFunctionResponseEventsString (functions) {
    return super.addFunctionResponseEventsString(functions)
  }

  /**
   * Helper method to get a file from the file set
   * @param {string} fileName
   */
  getFileByName (fileName) {
    return super.getFileByName(fileName)
  }

  /**
   * Helper method to update a file in file set
   * @param {File} file
   */
  updateFile (file) {
    super.updateFile(file)
  }

  /**
   * Replace value by data pattern in a file
   * @param {File} file
   * @param {string: placeholder, string: content} data
   * @param {[string: START_DELIMITER, string: END_DELIMITER]} delimiter
   */
  replaceInFile (file, data, delimiter) {
    super.replaceInFile(file, data, delimiter)
  }

  /**
   * Replace value by data pattern in a content string
   * @param {string} content
   * @param {string: placeholder, string: content} data
   * @param {[string: START_DELIMITER, string: END_DELIMITER]} delimiter
   * @returns {string} updated content
   */
  replaceInContent (content, data, delimiter) {
    return super.replaceInContent(content, data, delimiter)
  }
}
