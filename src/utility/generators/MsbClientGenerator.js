export default class MsbClientGenerator {
  constructor (generateCounterpart = false, fileSet = undefined, msbSelfDescriptionUtil = undefined) {
    if (!this.setGenerateCounterpart) {
      throw new Error("MsbClientGenerator's must provide the possibility to generate a counterpart service!")
    }
    if (!this.getFileSet) {
      throw new Error("MsbClientGenerator's must provide a file set of all client files!")
    }
    if (!this.generateCode) {
      throw new Error("MsbClientGenerator's must generate code for the client")
    }
    if (!fileSet) {
      throw new Error("MsbClientGenerator's need a set of template files")
    }
    this.generateCounterpart = generateCounterpart
    this.fileSet = fileSet
    this.msbSelfDescriptionUtil = msbSelfDescriptionUtil
  }

  /**
   * Setter to activate the generation of a counterpart service
   * @param {boolean} generateCounterpart
   */
  setGenerateCounterpart (generateCounterpart = true) {
    this.generateCounterpart = generateCounterpart
  }

  /**
   * Getter to check if the generation of a counterpart service is enabled
   * @returns {boolean}
   */
  getGenerateCounterpart () {
    return this.generateCounterpart
  }

  /**
   * Get the file set
   */
  getFileSet () {
    return this.fileSet
  }

  /**
   * Get the util to extract the information from self description
   */
  getMsbSelfDescriptionUtilt () {
    return this.msbSelfDescriptionUtil
  }

  /**
   * Update msb client basic settings (uuid, name, token) for counterpart generation
   * @param {settings} settings
   * @returns {settings} settings
   */
  updateSettingsForCounterpart (settings) {
    const uuidv4 = require('uuid/v4')
    settings.uuid = uuidv4()
    settings.token = settings.uuid.substring(0, 7)
    settings.name = settings.name + "_counterpart"
    return settings
  }

  /**
   * Transform a list of events into a list of functions
   * @param {events} events
   * @returns {functions} functions
   */
  transformEventsToFunctions (events) {
    var functions = events
    if (functions) {
      functions.forEach(function (func, index, theArray) {
        func.functionId = func.eventId + '_FUNCTION'
      })
    }
    return functions
  }

  /**
   * Transform a list of functions into a list of events
   * @param {functions} functions
   * @returns {events} events
   */
  transformFunctionsToEvents (functions) {
    var events = functions
    if (events) {
      events.forEach(function (event, index, theArray) {
        event.eventId = event.functionId + '_EVENT'
      })
    }
    return events
  }

  /**
   * Add a string representing the response events to be added to the add function
   * @param {functions} functions
   * @returns {functions} functions with functions objects including a responseEventsString param
   */
  addFunctionResponseEventsString (functions) {
    if (functions) {
      for (var functionkey in functions) {
        var func = functions[functionkey]
        var functionResponseEventsString = ''
        if (func.responseEvents && func.responseEvents.length > 0) {
          var msbSelfDescriptionUtil = this.getMsbSelfDescriptionUtilt()
          for (var respEventNrKey in func.responseEvents) {
            var respEventNr = func.responseEvents[respEventNrKey]
            var respEvent = msbSelfDescriptionUtil.getEventByIndex(respEventNr)
            if (respEvent) {
              if (functionResponseEventsString === '') {
                functionResponseEventsString = '"' + respEvent.eventId + '"'
              } else {
                functionResponseEventsString = functionResponseEventsString + ', "' + respEvent.eventId + '"'
              }
            } else {
              console.log('Cannot find an event for the given index of response events: ' + respEventNr)
            }
          }
        }
        func.responseEventsString = functionResponseEventsString
        functions[functionkey] = func
      }
    }
    return functions
  }

  /**
   * Remove all events or functions with a complex object in dataFormat
   * @param {eventsOrFunctions} List of events or functions
   * @returns {eventsOrFunctions} eventsOrFunctions
   */
  removeEventsOrFunctionsWithComplexObjects (eventsOrFunctions) {
    if (eventsOrFunctions) {
      eventsOrFunctions = eventsOrFunctions.filter(function (eventOrFunction, index) {
        return (
          (eventOrFunction.eventId ? eventOrFunction.eventId : eventOrFunction.functionId) !== 'CONNECTED' &&
          (eventOrFunction.eventId ? eventOrFunction.eventId : eventOrFunction.functionId) !== 'UNCONNECTED' &&
          (
            !eventOrFunction.dataFormat.dataObject ||
              (
                eventOrFunction.dataFormat.dataObject &&
                eventOrFunction.dataFormat.dataObject.hasOwnProperty('type') &&
                eventOrFunction.dataFormat.dataObject.type !== 'object' &&
                !eventOrFunction.dataFormat.dataObject.hasOwnProperty('$ref'))
          )
        )
      })
    }
    return eventsOrFunctions
  }

  /**
   * Helper method to get a file from the file set
   * @param {string} fileName
   */
  getFileByName (fileName) {
    for (var fileKey in this.fileSet) {
      var file = this.fileSet[fileKey]
      if (file.fileName === fileName) {
        return file
      }
    }
    console.debug('File not founde in file set: ' + fileName)
    return undefined
  }

  /**
   * Helper method to update a file in file set
   * @param {File} file
   */
  updateFile (file) {
    this.fileSet[file.fileName] = file
  }

  /**
   * Replace value by data pattern in a file
   * @param {File} file
   * @param {string: placeholder, string: content} data
   * @param {[string: START_DELIMITER, string: END_DELIMITER]} delimiter
   */
  replaceInFile (file, data, delimiter) {
    file.content = this.replaceInContent(file.content, data, delimiter)

    this.updateFile(file)
  }

  /**
   * Replace value by data pattern in a content string
   * @param {string} content
   * @param {string: placeholder, string: content} data
   * @param {[string: START_DELIMITER, string: END_DELIMITER]} delimiter
   * @returns {string} updated content
   */
  replaceInContent (content, data, delimiter) {
    Object.keys(data).forEach((key, i) => {
      const regexp = new RegExp(delimiter[0] + key + delimiter[1], 'g')
      const value = typeof data[key] === 'function' ? data[key](key, i, data, content) : data[key]

      content = content.replace(regexp, value)
    })
    return content
  }
}
