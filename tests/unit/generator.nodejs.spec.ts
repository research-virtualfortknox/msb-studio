import { expect } from 'chai'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CodeGenerator from '@/components//CodeGenerator.vue'
// @ts-ignore
// eslint-disable-next-line
import msbSelfDescTestContent from './msb-selfdesc-test.json'

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import applicationPropertiesFileContent from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client/application.properties'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import indexFileContent from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client/index.js'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import packageJsonFileContent from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client/package.json.raw'

// counterpart files
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import applicationPropertiesFileContentCounterpart from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client_counterpart/application.properties'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import indexFileContentCounterpart from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client_counterpart/index.js'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import packageJsonFileContentCounterpart from '!!raw-loader!./expected_generator_results/NodeJs_MySampleApp_client_counterpart/package.json.raw'

// ajv is used to validate specified dataformats of the msb client
const Ajv = require('ajv')
// array of unknown format names will be ignored
const ajv = new Ajv({ schemaId: 'auto', allErrors: true, unknownFormats: ['float', 'double', 'int32', 'int64'] })
// explicitly add the meta-schema (json) to the validator instance
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

const localVue = createLocalVue()

describe('MSB NodeJS Client Generator', () => {
  // @ts-ignore
  let vuetify

  beforeEach(function () {
    vuetify = new Vuetify()
  })

  it('validate generated project files', () => {
    // check first if the source msb selfdesc file is valid according to its json schema
    expect(validateMsbSelfDescriptionBySchema(msbSelfDescTestContent)).to.equal(true)

    const wrapper = shallowMount(CodeGenerator, {
      data () {
        return {
          codeSource: JSON.stringify(msbSelfDescTestContent),
          sourceOptions: {
            sourceLanguage: 'msbSelfDescription'
          },
          targetOptions: {
            targetLanguage: 'JavaScript',
            generateCounterpart: false
          },
          fileSet: undefined
        }
      },
      propsData: {
      },
      localVue,
      // @ts-ignore
      vuetify
    })
    expect(wrapper.vm.$data.sourceOptions.sourceLanguage).to.equal('msbSelfDescription')
    expect(wrapper.vm.$data.targetOptions.targetLanguage).to.equal('JavaScript')
    expect(wrapper.vm.$data.targetOptions.generateCounterpart).to.equal(false)

    var verifiedFileApplicationProperties = false
    var verifiedFileIndexFile = false
    var verifiedFilePackageJson = false

    // current generated files
    var generatedFileSet = wrapper.vm.$data.fileSet

    // compare expected generator results with current generator results
    // @ts-ignore
    generatedFileSet.forEach(function (file) {
      if (file.fileName === 'application.properties') {
        expect(file.content).to.equal(applicationPropertiesFileContent)
        verifiedFileApplicationProperties = true
      }
      if (file.fileName === 'index.js') {
        expect(file.content).to.equal(indexFileContent)
        verifiedFileIndexFile = true
      }
      if (file.fileName === 'package.json') {
        expect(file.content).to.equal(packageJsonFileContent)
        verifiedFilePackageJson = true
      }
    })

    // verify that all files were tested
    expect(verifiedFileApplicationProperties).to.equal(true)
    expect(verifiedFileIndexFile).to.equal(true)
    expect(verifiedFilePackageJson).to.equal(true)
  })

  it('validate generated project files (counterpart)', () => {
    // check first if the source msb selfdesc file is valid according to its json schema
    expect(validateMsbSelfDescriptionBySchema(msbSelfDescTestContent)).to.equal(true)

    const wrapper = shallowMount(CodeGenerator, {
      data () {
        return {
          codeSource: JSON.stringify(msbSelfDescTestContent),
          sourceOptions: {
            sourceLanguage: 'msbSelfDescription'
          },
          targetOptions: {
            targetLanguage: 'JavaScript',
            generateCounterpart: true
          },
          fileSet: undefined
        }
      },
      propsData: {
      },
      localVue,
      // @ts-ignore
      vuetify
    })
    expect(wrapper.vm.$data.sourceOptions.sourceLanguage).to.equal('msbSelfDescription')
    expect(wrapper.vm.$data.targetOptions.targetLanguage).to.equal('JavaScript')
    expect(wrapper.vm.$data.targetOptions.generateCounterpart).to.equal(true)

    var verifiedFileApplicationProperties = false
    var verifiedFileIndexFile = false
    var verifiedFilePackageJson = false

    // current generated files
    var generatedFileSet = wrapper.vm.$data.fileSet

    // compare expected generator results with current generator results
    // @ts-ignore
    generatedFileSet.forEach(function (file) {
      if (file.fileName === 'application.properties') {

        var fileContentCounterpart = removeUuidAndTokenLinesFromApplicationProperties(file.content)
        var fileContentCounterpartExpected = removeUuidAndTokenLinesFromApplicationProperties(applicationPropertiesFileContentCounterpart)

        expect(fileContentCounterpart).to.equal(fileContentCounterpartExpected)
        verifiedFileApplicationProperties = true
      }
      if (file.fileName === 'index.js') {
        expect(file.content).to.equal(indexFileContentCounterpart)
        verifiedFileIndexFile = true
      }
      if (file.fileName === 'package.json') {
        expect(file.content).to.equal(packageJsonFileContentCounterpart)
        verifiedFilePackageJson = true
      }
    })

    // verify that all files were tested
    expect(verifiedFileApplicationProperties).to.equal(true)
    expect(verifiedFileIndexFile).to.equal(true)
    expect(verifiedFilePackageJson).to.equal(true)
  })
})

// @ts-ignore
function validateMsbSelfDescriptionBySchema (msbSelfDescription) {
  let schema = require('@/utility/schemas/selfdescription_schema.json')
  let validate = ajv.compile(schema)
  let valid = validate(msbSelfDescription)
  return valid
}

// @ts-ignore
function removeUuidAndTokenLinesFromApplicationProperties (fileContent) {
  var linesToDelete = [
    0, // msb.uuid
    3 // msb.token
  ]
  var lines = fileContent.split('\n');
  linesToDelete.forEach(function (lineNr, index) {
    // remove one line, starting from position
    lines.splice(lineNr - index,1)
  })
  return lines.join('\n');
}
