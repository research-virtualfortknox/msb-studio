import { expect } from 'chai'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import CodeGenerator from '@/components//CodeGenerator.vue'
// @ts-ignore
// eslint-disable-next-line
import msbSelfDescTestContent from './msb-selfdesc-test.json'

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import msbClientFlowFileContent from '!!raw-loader!./expected_generator_results/NodeRed_MySampleApp_client/msb-client-flow.json.raw'

// counterpart files
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import msbClientFlowFileContentCounterpart from '!!raw-loader!./expected_generator_results/NodeRed_MySampleApp_client_counterpart/msb-client-flow.json.raw'

// ajv is used to validate specified dataformats of the msb client
const Ajv = require('ajv')
// array of unknown format names will be ignored
const ajv = new Ajv({ schemaId: 'auto', allErrors: true, unknownFormats: ['float', 'double', 'int32', 'int64'] })
// explicitly add the meta-schema (json) to the validator instance
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

const localVue = createLocalVue()

describe('MSB Node-RED Client Flow Generator', () => {
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
            targetLanguage: 'Node-RED',
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
    expect(wrapper.vm.$data.targetOptions.targetLanguage).to.equal('Node-RED')
    expect(wrapper.vm.$data.targetOptions.generateCounterpart).to.equal(false)

    var verifiedMsbClientFlow = false

    // current generated files
    var generatedFileSet = wrapper.vm.$data.fileSet
    generatedFileSet = checkAndConvertLineEndingsIfOnWinPlatform(generatedFileSet)

    // compare expected generator results with current generator results
    // @ts-ignore
    generatedFileSet.forEach(function (file) {
      if (file.fileName === 'msb-client-flow.json') {
        var fileContentCounterpart = removeUuidAndTokenLinesFromMsbClientFlow(file.content)
        var fileContentCounterpartExpected = removeUuidAndTokenLinesFromMsbClientFlow(msbClientFlowFileContent)

        expect(fileContentCounterpart).to.equal(fileContentCounterpartExpected)
        verifiedMsbClientFlow = true
      }
    })

    // verify that all files were tested
    expect(verifiedMsbClientFlow).to.equal(true)
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
            targetLanguage: 'Node-RED',
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
    expect(wrapper.vm.$data.targetOptions.targetLanguage).to.equal('Node-RED')
    expect(wrapper.vm.$data.targetOptions.generateCounterpart).to.equal(true)

    var verifiedMsbClientFlow = false

    // current generated files
    var generatedFileSet = wrapper.vm.$data.fileSet
    generatedFileSet = checkAndConvertLineEndingsIfOnWinPlatform(generatedFileSet)

    // compare expected generator results with current generator results
    // @ts-ignore
    generatedFileSet.forEach(function (file) {
      if (file.fileName === 'msb-client-flow.json') {
        var fileContentCounterpart = removeUuidAndTokenLinesFromMsbClientFlow(file.content)
        var fileContentCounterpartExpected = removeUuidAndTokenLinesFromMsbClientFlow(msbClientFlowFileContentCounterpart)

        expect(fileContentCounterpart).to.equal(fileContentCounterpartExpected)
        verifiedMsbClientFlow = true
      }
    })

    // verify that all files were tested
    expect(verifiedMsbClientFlow).to.equal(true)
  })
})

/**
 * Check if test is executed on windows
 * If platform is windows, convert all line endings to CRLF (\r\n)
 * @param {FileSet} fileSet provided by the code generators
 * @return {FileSet} updated fileSet
 */
// @ts-ignore
function checkAndConvertLineEndingsIfOnWinPlatform (fileSet) {
  // @ts-ignore
  if (process.platform === 'win32') {
    // @ts-ignore
    fileSet.forEach(function (file, index, theArray) {
      file.content = file.content.replace(/\r?\n/g, '\r\n')
      theArray[index] = file
    })
  }
  return fileSet
}

// @ts-ignore
function validateMsbSelfDescriptionBySchema (msbSelfDescription) {
  let schema = require('@/utility/schemas/selfdescription_schema.json')
  let validate = ajv.compile(schema)
  let valid = validate(msbSelfDescription)
  return valid
}

// @ts-ignore
function removeUuidAndTokenLinesFromMsbClientFlow (fileContent) {
  var linesToDelete = [
    2, // id
    4, // uuid
    7, // token
    171, // output wired 0
    174, // output wired 1
    177, // output wired 2
    180, // output wired 3
    183, // output wired 4
    186, // output wired 5
    189, // output wired 6
    192, // output wired 7
    195, // output wired 8
    198, // output wired 9
    201, // output wired 10
    206, // event id
    214, // event wired
    219, // event id
    227, // event wired
    232, // event id
    240, // event wired
    245, // event id
    253, // event wired
    258, // event id
    266, // event wired
    271, // event id
    279, // event wired
    284, // event id
    292, // event wired
    297, // event id
    305, // event wired
    310, // event id
    318, // event wired
    323, // event id
    331, // event wired
    336 // debug id
  ]
  var lines = fileContent.split('\n')
  linesToDelete.forEach(function (lineNr, index) {
    // remove one line, starting from position
    lines.splice(lineNr - index, 1)
  })
  return lines.join('\n')
}
