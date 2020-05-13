import { expect } from 'chai'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CodeGenerator from '@/components//CodeGenerator.vue'
// @ts-ignore
// eslint-disable-next-line
import msbSelfDescTestContent from './msb-selfdesc-test.json'

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import applicationPropertiesFileContent from '!!raw-loader!./expected_generator_results/Python_MySampleApp_client/application.properties'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mainFileContent from '!!raw-loader!./expected_generator_results/Python_MySampleApp_client/main.py'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import pipfileFileContent from '!!raw-loader!./expected_generator_results/Python_MySampleApp_client/Pipfile'

// ajv is used to validate specified dataformats of the msb client
const Ajv = require('ajv')
// array of unknown format names will be ignored
const ajv = new Ajv({ schemaId: 'auto', allErrors: true, unknownFormats: ['float', 'double', 'int32', 'int64'] })
// explicitly add the meta-schema (json) to the validator instance
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

const localVue = createLocalVue()

describe('MSB Python Client Generator', () => {
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
            targetLanguage: 'Python',
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
    expect(wrapper.vm.$data.targetOptions.targetLanguage).to.equal('Python')
    expect(wrapper.vm.$data.targetOptions.generateCounterpart).to.equal(false)

    var verifiedFileApplicationProperties = false
    var verifiedFileMainFile = false
    var verifiedFilePipfile = false

    // current generated files
    var generatedFileSet = wrapper.vm.$data.fileSet

    // compare expected generator results with current generator results
    // @ts-ignore
    generatedFileSet.forEach(function (file) {
      if (file.fileName === 'application.properties') {
        expect(file.content).to.equal(applicationPropertiesFileContent)
        verifiedFileApplicationProperties = true
      }
      if (file.fileName === 'main.py') {
        expect(file.content).to.equal(mainFileContent)
        verifiedFileMainFile = true
      }
      if (file.fileName === 'Pipfile') {
        expect(file.content).to.equal(pipfileFileContent)
        verifiedFilePipfile = true
      }
    })

    // verify that all files were tested
    expect(verifiedFileApplicationProperties).to.equal(true)
    expect(verifiedFileMainFile).to.equal(true)
    expect(verifiedFilePipfile).to.equal(true)
  })
})

// @ts-ignore
function validateMsbSelfDescriptionBySchema (msbSelfDescription) {
  let schema = require('@/utility/schemas/selfdescription_schema.json')
  let validate = ajv.compile(schema)
  let valid = validate(msbSelfDescription)
  return valid
}
