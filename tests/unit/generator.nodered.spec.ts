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
    133, // output wired 0
    136, // output wired 1
    139, // output wired 2
    142, // output wired 3
    145, // output wired 4
    148, // output wired 5
    151, // output wired 6
    154, // output wired 7
    157, // output wired 8
    162, // event id
    170, // event wired
    175, // event id
    183, // event wired
    188, // event id
    196, // event wired
    201, // event id
    209, // event wired
    214, // event id
    222, // event wired
    227, // event id
    235, // event wired
    240, // event id
    248, // event wired
    253, // event id
    261, // event wired
    266 // debug id
  ]
  var lines = fileContent.split('\n')
  linesToDelete.forEach(function (lineNr, index) {
    // remove one line, starting from position
    lines.splice(lineNr - index, 1)
  })
  return lines.join('\n')
}
