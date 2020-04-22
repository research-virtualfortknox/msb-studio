'use strict'

import MsbSelfDescriptionUtil from './MsbSelfDescriptionUtil.js'
import MsbClientGeneratorNodeJs from './generators/MsbClientGeneratorNodeJs.js'
import MsbClientGeneratorPython from './generators/MsbClientGeneratorPython.js'

/**
 * MsbStudio to auto-generate code for apps and other services based on msb self-description
 */
export default class MsbStudio {
  constructor () {
    this.msbSelfDescriptionUtil = null
    this.msbClientGenerator = null
  }

  /**
   * Generate a set of files including code and metadata to be used as template project
   * @param {string} selfDescription  - The stringified self-description json
   * @param {string} targetLanguage - The language of the target project (JavaScript for NodeJs, Python, Java, C++, C#)
   * @param {boolean} generateCounterpart - True if the generated service is a counterpart of the service of the self-description
   */
  convertSelfDescriptionToMsbClient (
    selfDescription,
    targetLanguage,
    generateCounterpart = false
  ) {
    this.msbSelfDescriptionUtil = new MsbSelfDescriptionUtil(selfDescription)
    switch (targetLanguage) {
      case 'JavaScript':
        this.msbClientGenerator = new MsbClientGeneratorNodeJs(generateCounterpart, this.msbSelfDescriptionUtil)
        break
      case 'Python':
        this.msbClientGenerator = new MsbClientGeneratorPython(generateCounterpart, this.msbSelfDescriptionUtil)
        break
      default:
        return
    }

    // add client basic settings
    this.msbClientGenerator.generateCode(
      this.msbSelfDescriptionUtil
    )

    return this.msbClientGenerator.getFileSet()
  }

  /**
   * Get the service name from a self-description
   * @param {string} selfDescription  - The stringified self-description json
   */
  getName (selfDescription) {
    this.msbSelfDescriptionUtil = new MsbSelfDescriptionUtil(selfDescription)
    return this.msbSelfDescriptionUtil.getName()
  }
};
