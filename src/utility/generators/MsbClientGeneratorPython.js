'use strict'

import MsbClientGenerator from './MsbClientGenerator'
import MsbSelfDescriptionUtil from '../MsbSelfDescriptionUtil.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import applicationPropertiesFileContent from '!!raw-loader!../templates/msb-client-websocket-python/application.properties'
// eslint-disable-next-line import/no-webpack-loader-syntax
import mainFileContent from '!!raw-loader!../templates/msb-client-websocket-python/main.py'
// eslint-disable-next-line import/no-webpack-loader-syntax
import pipFileContent from '!!raw-loader!../templates/msb-client-websocket-python/Pipfile'
// eslint-disable-next-line import/no-webpack-loader-syntax
import readmeFileContent from '!!raw-loader!../templates/msb-client-websocket-python/README.md'

// Template Engine
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
        fileName: 'main.py',
        content: mainFileContent,
        targetPath: '',
        format: 'js'
      },
      {
        fileName: 'Pipfile',
        content: pipFileContent,
        targetPath: '',
        format: 'properties'
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
    // add client basic settings
    this.generateApplicationProperties(
      msbSelfDescriptionUtil.getSettings()
    )
    // add configuration params
    this.generateMainFile(
      msbSelfDescriptionUtil.getConfigurationParamsAsArray(),
      msbSelfDescriptionUtil.getEvents(),
      msbSelfDescriptionUtil.getFunctions()
    )
  }

  /**
   * Add the basic settings for your service
   * @param {object} settings {type, uuid, name, description, token}
   */
  generateApplicationProperties (settings) {
    var generateCounterpart = super.getGenerateCounterpart()
    var file = this.getFileByName('application.properties')
    let template = ejs.compile(file.content)

    var generatedUuid
    var generatedToken
    if (generateCounterpart) {
      generatedUuid = uuidv4()
      generatedToken = generatedUuid.substring(0, 7)
    }

    var templateData = {
      generateCounterpart: generateCounterpart,
      generatedUuid: generatedUuid,
      generatedToken: generatedToken,
      settings: settings
    }
    file.content = template(templateData)
    this.updateFile(file)
  }

  /**
   * Add configuration params, events and functions to the main file
   * @param {[ConfigurationParameter]} params
   * @param {[Event]} events
   * @param {[Function]} functions
   */
  generateMainFile (params, events, functions) {
    var file = this.getFileByName('main.py')
    let template = ejs.compile(file.content)
    var templateData = {}
    // if a counterpart is generated, switch events and functions
    if (!this.generateCounterpart) {
      functions = this.addFunctionResponseEventsString(functions)
      templateData = {
        params: params,
        events: events,
        functions: functions
      }
    } else {
      templateData = {
        params: params,
        events: functions,
        functions: events
      }
    }
    file.content = template(templateData)
    this.updateFile(file)
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
