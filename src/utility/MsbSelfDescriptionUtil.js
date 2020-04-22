'use strict'

const uuidv4 = require('uuid/v4')

export default class MsbSelfDescriptionUtil {
  constructor (selfDescription) {
    // setup all files here
    this.setSelfDescription(selfDescription)
  }

  getSelfDescription () {
    return this.selfDescription
  };

  setSelfDescription (selfDescription) {
    try {
      this.selfDescription = JSON.parse(selfDescription)
    } catch (e) {
      throw e
    }
  };

  getSettings () {
    var settings = {
      type: this.getType(),
      uuid: this.getUuid(),
      name: this.getName(),
      description: this.getDescription(),
      token: this.getToken()
    }
    return settings
  };

  getType () {
    if (this.selfDescription['@class']) {
      return this.selfDescription['@class']
    } else {
      throw new Error('Missing type in self description')
    }
  };

  getUuid () {
    if (this.selfDescription['uuid']) {
      return this.selfDescription['uuid']
    } else {
      throw new Error('Missing uuid in self description')
    }
  };

  getName () {
    if (this.selfDescription['name']) {
      return this.selfDescription['name']
    } else {
      throw new Error('Missing name in self description')
    }
  };

  getDescription () {
    if (this.selfDescription['description']) {
      return this.selfDescription['description']
    } else {
      throw new Error('Missing description in self description')
    }
  };

  getToken () {
    if (this.selfDescription['token']) {
      return this.selfDescription['token']
    } else {
      return uuidv4().substring(0, 7)
    }
  };

  getConfigurationParams () {
    if (this.selfDescription['configuration'] && this.selfDescription['configuration']['parameters']) {
      return this.selfDescription['configuration']['parameters']
    } else {
      return undefined
    }
  };

  getConfigurationParamsAsArray () {
    var params = this.getConfigurationParams()
    var paramsAsArray = []
    if (params) {
      for (var paramkey in params) {
        var param = params[paramkey]
        param.key = paramkey
        paramsAsArray.push(param)
      }
      return paramsAsArray
    } else {
      return undefined
    }
  };

  getEvents () {
    if (this.selfDescription['events']) {
      return this.selfDescription['events']
    } else {
      return []
    }
  };

  getEventByIndex (index) {
    var events = this.getEvents()
    if (events) {
      for (var eventkey in events) {
        var event = events[eventkey]
        if (event['@id'] === index) {
          return event
        }
      }
    }
    return undefined
  }

  getFunctions () {
    if (this.selfDescription['functions']) {
      return this.selfDescription['functions']
    } else {
      return []
    }
  };

  getDataModels () {
    // TODO: To implements ... get all complex objects as data model from self descriptjion
  }
};
