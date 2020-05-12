'use strict'

import MsbClientGenerator from './MsbClientGenerator'
// eslint-disable-next-line import/no-webpack-loader-syntax
import applicationPropertiesFileContent from '!!raw-loader!../templates/msb-client-websocket-nodejs/application.properties'
// eslint-disable-next-line import/no-webpack-loader-syntax
import indexFileContent from '!!raw-loader!../templates/msb-client-websocket-nodejs/index.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import packageJsonFileContent from '!!raw-loader!../templates/msb-client-websocket-nodejs/package.json.raw'
// eslint-disable-next-line import/no-webpack-loader-syntax
import readmeFileContent from '!!raw-loader!../templates/msb-client-websocket-nodejs/README.md'
import MsbSelfDescriptionUtil from '../MsbSelfDescriptionUtil'

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
export default class MsbClientGeneratorNodeJs extends MsbClientGenerator {
  constructor (generateCounterpart = false, msbSelfDescriptionUtil) {
    // setup all files from the teamplte here
    var fileSet = [
      {
        fileName: 'application.properties',
        content: applicationPropertiesFileContent,
        targetPath: '', // use folder1/folder2/
        format: 'properties'
      },
      {
        fileName: 'index.js',
        content: indexFileContent,
        targetPath: '',
        format: 'js'
      },
      {
        fileName: 'package.json',
        content: packageJsonFileContent,
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

    // preparation
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

    // add client basic settings
    this.generateApplicationProperties(
      settings
    )

    // add configuration params
    this.generateMainFile(
      params,
      events,
      functions
    )
  }

  /**
   * Add the basic settings for your service
   * @param {object} settings {type, uuid, name, description, token}
   */
  generateApplicationProperties (settings) {
    var file = this.getFileByName('application.properties')
    let template = ejs.compile(file.content)
    var file2 = this.getFileByName('package.json')
    let template2 = ejs.compile(file2.content)

    var templateData = {
      settings: settings
    }
    file.content = template(templateData)
    this.updateFile(file)
    file2.content = template2(templateData)
    this.updateFile(file2)
  }

  /**
   * Add configuration params, events and functions to the main file
   * @param {[ConfigurationParameter]} params
   * @param {[Event]} events
   * @param {[Function]} functions
   */
  generateMainFile (params, events, functions) {
    var file = this.getFileByName('index.js')
    let template = ejs.compile(file.content)

    var templateData = {
      params: params,
      events: events,
      functions: functions
    }
    file.content = template(templateData)
    this.updateFile(file)
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
