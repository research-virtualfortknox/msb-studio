<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      fill-height
      row
      pl-3
      pr-3
    >

      <v-flex
        md6
        pr-1
        pl-1
        style="position: relative;"
      >
        <v-row>
          <v-col>
            <v-select
              label="Source Format"
              v-model="sourceOptions.sourceLanguage"
              :items="sourceLanguages"
              @change="onSelectSourceLanguageChange"
            ></v-select>
          </v-col>
          <v-col v-if="sourceOptions.sourceLanguage != 'msbSelfDescription'">
            <v-text-field
              v-model="targetOptions.topLevelName"
              :rules="[rules.required]"
              label="Top Level Name"
              @input="onOptionsChaned"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-toolbar height="36px" flat>
          <div class="editor-menu-title">Editor</div>

          <v-btn
            v-on:click="$refs.myCodeEditor.undo()"
            text icon small>
            <v-icon small>mdi-undo</v-icon>
          </v-btn>

          <v-btn
            v-on:click="$refs.myCodeEditor.redo()"
            text icon small>
            <v-icon small>mdi-redo</v-icon>
          </v-btn>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on:click="clearSourceEditor"
                v-on="on"
                text icon small>
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Clear Editor</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on:click="formatCodeSource"
                v-on="on"
                text icon small>
                <v-icon small>mdi-code-braces</v-icon>
              </v-btn>
            </template>
            <span>Format Code</span>
          </v-tooltip>

          <v-dialog v-model="dialogLoadSelfDescriptionFromMsb" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    v-on="{ ...tooltip, ...dialog }"
                    :disabled="sourceOptions.sourceLanguage != 'msbSelfDescription'"
                    text icon small>
                    <v-icon small>mdi-cloud-download</v-icon>
                  </v-btn>
                </template>
                <span>Get self description from MSB instance</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Load Self Description</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Smart Object Mgmt Url"
                        hint="For example, http://{ip or domain}:{port}"
                        v-model="smartObjectMgmtUrl"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Service UUID"
                        hint="UUID of the service (get it from MSB GUI or from project settings)"
                        v-model="smartObjectMgmtServiceUuid"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="User"
                        hint="Provide a username if the Smart Object Management requires basic auth"
                        v-model="smartObjectMgmtUser"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Password"
                        hint="Provide a password if the Smart Object Management requires basic auth"
                        type="password"
                        v-model="smartObjectMgmtPassword"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-alert
                    v-if="loadSelfDescriptionError"
                    border="left"
                    type="error"
                    text
                    class="validation-errors">
                    <div>
                      {{ loadSelfDescriptionError.message }}
                    </div>
                  </v-alert>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn text
                  v-on:click="
                    dialogLoadSelfDescriptionFromMsb = false;
                    loadSelfDescriptionError = undefined;
                  "
                >Close</v-btn>
                <v-btn text
                  v-on:click="
                    loadMsbSelfDescriptionFromSmartObjectMgmt();
                    dialogLoadSelfDescriptionFromMsbLoaderActive = true;
                    loadSelfDescriptionError = undefined;
                  "
                >Load</v-btn>
              </v-card-actions>
              <v-overlay :value="dialogLoadSelfDescriptionFromMsbLoaderActive">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
              </v-overlay>
            </v-card>
          </v-dialog>

          <div class="flex-grow-1"></div>

        </v-toolbar>

        <prism-editor
          ref="myCodeEditor"
          v-if="isMyCodeEditorActive"
          v-model="codeSource"
          language="json"
          :line-numbers="lineNumbers"
          @change="onOptionsChaned"
          class="my-code-editor  overflow-y-auto"/>
        <v-alert
          v-model="validationErrorsVisible"
          v-if="validationErrors.length > 0"
          border="left"
          type="error"
          text
          dismissible
          class="validation-errors validation-errors-editor">
          <div v-for="validationError in validationErrors" v-bind:key="validationError.id">
            {{ validationError.error.message }}
          </div>
        </v-alert>
      </v-flex>

      <v-flex
        md6
        pr-1
        pl-1
      >
        <v-row>
          <v-col>
            <v-select
              label="Target Language"
              v-model="targetOptions.targetLanguage"
              :items="targetLanguages"
              @change="onSelectTargetLanguageChange"
            ></v-select>
          </v-col>
        </v-row>
        <v-toolbar height="36px" flat>
          <div class="editor-menu-title">Code Generation</div>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                rounded outlined small
                v-on="on"
                v-on:click="switchGenerateCounterpart"
                :disabled="sourceOptions.sourceLanguage != 'msbSelfDescription'"
                class="editor-menu-checkbtn"
              >
                <v-icon v-if="targetOptions.generateCounterpart">mdi-checkbox-marked-circle</v-icon>
                <v-icon v-if="!targetOptions.generateCounterpart">mdi-checkbox-blank-circle-outline</v-icon>
                COUNTERPART
              </v-btn>
            </template>
            <span>Generate counterpart for the service</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on:click="generateClientZip"
                v-on="on"
                :disabled="!fileSet"
                text icon small
              >
                <v-icon small>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Download project</span>
          </v-tooltip>

          <div class="flex-grow-1"></div>

        </v-toolbar>
        <div
          class="code-genetation-container overflow-y-auto"
          >
          <div v-for="file in fileSet" v-bind:key="file.fileName">
            <div v-if="file.format !== 'md'">
              <div class="Codeblock-title">{{ file.fileName }}</div>
              <prism :language="file.format" class="my-code-viewer">{{ file.content }}</prism>
            </div>
          </div>
          <div>
            <div class="Codeblock-title">Data Model</div>
            <prism :language="this.targetOptions.targetFormat" class="my-code-viewer">{{ this.codeTargett }}</prism>
          </div>
        </div>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import JSZip from 'jszip'
import axios from 'axios'

import {
  JsonExample,
  JsonSchemaExample,
  MsbSelfDescriptionExample
} from './examples-for-editor-source'

// @ts-ignore
import MsbStudio from '../utility/MsbStudio.js'
// @ts-ignore
import Prism from 'vue-prism-component'
// @ts-ignore
import PrismEditor from 'vue-prism-editor'

import {
  quicktype,
  languageNamed,
  SerializedRenderResult,
  defaultTargetLanguages,
  JSONSchemaInput,
  InputData,
  TargetLanguage,
  jsonInputForTargetLanguage,
  RendererOptions,
  Options,
  inferenceFlagNames
} from 'quicktype-core'

// ajv is used to validate specified dataformats of the msb client
const Ajv = require('ajv')
// array of unknown format names will be ignored
const ajv = new Ajv({ schemaId: 'auto', allErrors: true, unknownFormats: ['float', 'double', 'int32', 'int64'] })
// explicitly add the meta-schema (json) to the validator instance
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))

export default Vue.extend({
  components: {
    PrismEditor,
    Prism
  },
  data () {
    let sourceLanguages = [
      { text: 'MSB Self-Description', value: 'msbSelfDescription' },
      { text: 'Json', value: 'json' },
      { text: 'Json Schema', value: 'schema' }
    ]
    let targetLanguages = [
      { text: 'NodeJs', value: 'JavaScript', format: 'js' },
      { text: 'Python', value: 'Python', format: 'python' },
      { text: 'Java', value: 'Java', format: 'java' },
      { text: 'C++', value: 'C++', format: 'c' },
      { text: 'C#', value: 'C#', format: 'csharp' },
      { text: 'Json Schema', value: 'schema', format: 'json' }
    ]
    return {
      // options for source and target of code generation
      sourceLanguages: sourceLanguages,
      sourceOptions: {
        sourceLanguage: sourceLanguages[0].value
      },
      targetLanguages: targetLanguages,
      targetOptions: {
        targetLanguage: targetLanguages[0].value,
        targetFormat: targetLanguages[0].format,
        topLevelName: 'MyDevice',
        justTypes: false,
        generateCounterpart: false
      },
      validationErrors: [],
      validationErrorsVisible: false,

      // source editor (default content is Json sample)
      codeSource: MsbSelfDescriptionExample,
      lineNumbers: true,
      isMyCodeEditorActive: true,
      // result of quicktype code generation
      codeTargett: '',

      // self description
      // set of files with metadata storing the results of the client code generation
      fileSet: undefined,
      // dialog data to load self description from MSb Smart Object Mgmt
      dialogLoadSelfDescriptionFromMsb: false,
      dialogLoadSelfDescriptionFromMsbLoaderActive: false,
      loadSelfDescriptionError: undefined,
      smartObjectMgmtUrl: 'http://10.15.26.12:8081',
      smartObjectMgmtServiceUuid: '164jk78-34cf-4836-8cc1-7e0d934674',
      smartObjectMgmtUser: 'user',
      smartObjectMgmtPassword: 'password',

      // general validation rules for inputs
      rules: {
        // @ts-ignore
        required: value => !!value || 'Required.'
      }
    }
  },
  mounted () {
    // check if url query parameters are present
    // try {
    //   if (this.$route.query.codeSourceParam){
    //     console.log(this.$route.query.codeSourceParam)
    //     let codeSourceParamStringified = this.$route.query.codeSourceParam.toString()
    //     let codeSourceParam = JSON.parse(codeSourceParamStringified)
    //     this.codeSource = codeSourceParam
    //   }
    // } catch (err) {
    //   console.log('Error handling the url parameter selfDescriptionJsonString: ' + err)
    // }
    // after mounted, do the first code generation
    this.collectOptionsAndConvert()
  },

  methods: {

    // based on options for source and target,
    // convert source to target language
    collectOptionsAndConvert () {
      // reset validation errors
      this.validationErrors = []
      // validate json syntax
      if (!this.isJsonSyntaxValid(this.codeSource)) {
        return
      }

      // reset fileSet
      this.fileSet = undefined

      // use quicktype to generate code, if source is not an msb self descriptjion
      if (this.sourceOptions.sourceLanguage !== 'msbSelfDescription') {
        this.runQuicktype(
          this.codeSource,
          this.sourceOptions.sourceLanguage,
          this.targetOptions.targetLanguage,
          this.targetOptions.topLevelName,
          this.targetOptions.justTypes,
          ' '.repeat(4),
          ['Please find more information here:', 'https://github.com/research-virtualfortknox']
        ).then(result => {
          console.debug(result)
          this.codeTargett = result.lines.join('\n').trim()
        })
      // use custom converter for msb self description
      } else {
        this.convertMsbSelfDescriptionToClient()
      }
    },

    // use rest api of smart object mgmt to load an msb self description
    loadMsbSelfDescriptionFromSmartObjectMgmt () {
      let my = this
      axios
        .get(this.smartObjectMgmtUrl + '/service/' + my.smartObjectMgmtServiceUuid, {
        // Axios looks for the `auth` option, and, if it is set, formats a
        // basic auth header for you automatically.
          auth: {
            username: this.smartObjectMgmtUser,
            password: this.smartObjectMgmtPassword
          }
        })
        .then(function (response) {
        // get self description from response and update source editor content
          let selfDescription = JSON.stringify(response.data, null, 2)
          my.codeSource = selfDescription
          my.dialogLoadSelfDescriptionFromMsb = false
          my.collectOptionsAndConvert()
        })
        .catch(function (error) {
        // handle error of rest call
          console.error('Error on loading self description from MSB: ' + error)
          // show warning on dialog
          if (location.protocol === 'https:') {
            error = new Error(error.message + ': It is not allowed to execute a http request on a https app (mixed content). ' +
              'Either enter a https url or open this app via http (not secured).')
          }
          my.loadSelfDescriptionError = error
          my.dialogLoadSelfDescriptionFromMsb = true
        })
        .finally(function () {
          // always executed
          my.dialogLoadSelfDescriptionFromMsbLoaderActive = false
        })
    },

    // convert self description to an msb client application
    convertMsbSelfDescriptionToClient () {
      // validate self description
      let valid = this.validateMsbSelfDescription(this.codeSource)

      // init the msb studio
      let myMsbStudio = new MsbStudio()

      // check if a client generator is already available for the selected target language
      switch (this.targetOptions.targetLanguage) {
        case 'JavaScript':
          // TODO: Also use quicktype with self description by getting the data model as json schema
          this.codeTargett = 'Language supported, but no data model generatiion yet'
          break
        case 'Python':
          // TODO: Also use quicktype with self description by getting the data model as json schema
          this.codeTargett = 'Language supported, but no data model generatiion yet'
          break
        default:
          this.codeTargett = 'Language not supported yet: ' + this.targetOptions.targetLanguage
          return
      }

      // get the fileset including all generated client files and metadata
      this.fileSet = myMsbStudio.convertSelfDescriptionToMsbClient(
        this.codeSource, // the self description from source editor
        this.targetOptions.targetLanguage,
        this.targetOptions.generateCounterpart
      )
      console.debug(this.fileSet)
    },

    // validate if the json has syntax errors
    isJsonSyntaxValid (jsonString: string) {
      try {
        JSON.parse(jsonString)
        return true
      } catch (err) {
        let error = { message: err }
        this.validationErrors.push({ id: 'SYNTAX', category: 'Json Syntax', error: error })
        this.validationErrorsVisible = true
        return false
      }
    },

    // validate if the json of the self-description matches the json schema
    validateMsbSelfDescription (selfDescription: string) {
      let schema = require('../utility/schemas/selfdescription_schema.json')
      let validate = ajv.compile(schema)
      let valid = validate(JSON.parse(selfDescription))
      if (!valid) {
        for (var errorKey in validate.errors) {
          var error = validate.errors[errorKey]
          if (error.dataPath) {
            error.message = error.dataPath + ': ' + error.message
          }
          this.validationErrors.push({ id: 'SD-' + errorKey, category: 'Msb-Self-Description-Schema', error: error })
        }
        this.validationErrorsVisible = true
        return false
      } else {
        return true
      }
    },

    // integrate and run quicktype library
    async runQuicktype (
      content: string,
      kind: string,
      targetLanguage: string,
      topLevelName: string,
      justTypes: boolean,
      indentation: string | undefined,
      additionalLeadingComments: string[]
    ): Promise<SerializedRenderResult> {
      // get language object for target
      let lang = languageNamed(targetLanguage)!

      // set the renderer options
      const rendererOptions: RendererOptions = {}
      if (justTypes) {
        // FIXME: The target language should have a property to return these options.
        if (lang.name === 'csharp') {
          rendererOptions['features'] = 'just-types'
        } else if (lang.name === 'kotlin') {
          rendererOptions['framework'] = 'just-types'
        } else {
          rendererOptions['just-types'] = 'true'
        }
      }

      // set the input data object and add the code to be converted
      const inputData = new InputData()
      switch (kind) {
        case 'json':
          await inputData.addSource(
            'json',
            { name: topLevelName, samples: [content] },
            () => jsonInputForTargetLanguage(lang)
          )
          break
        case 'schema':
          await inputData.addSource(
            'schema',
            { name: topLevelName, schema: content },
            () => new JSONSchemaInput(undefined)
          )
          break
        default:
          throw new Error(`Unrecognized input format: ${kind}`)
      }

      const options: Partial<Options> = {
        lang: lang,
        inputData,
        leadingComments: ['VFK Research Proof of Concept for Client Code Generation'].concat(additionalLeadingComments),
        rendererOptions,
        indentation,
        inferMaps: true,
        inferEnums: true,
        inferUuids: true,
        inferDateTimes: true,
        inferIntegerStrings: true,
        inferBooleanStrings: true,
        ignoreJsonRefs: false
      }

      return quicktype(options)
    },

    // clear content of source editor
    clearSourceEditor () {
      this.codeSource = ''
    },

    // format code source
    formatCodeSource () {
      if (this.validationErrors.length === 0) {
        this.codeSource = JSON.stringify(JSON.parse(this.codeSource), null, 2)
      }
    },

    // general method to call if options were updated and codegeneration has to be triggered
    onOptionsChaned () {
      this.collectOptionsAndConvert()
    },

    switchGenerateCounterpart () {
      this.targetOptions.generateCounterpart = !this.targetOptions.generateCounterpart
      this.collectOptionsAndConvert()
    },

    // if source language changes, update sample code for source editor
    onSelectSourceLanguageChange () {
      switch (this.sourceOptions.sourceLanguage) {
        case 'json':
          this.codeSource = JsonExample
          break
        case 'schema':
          this.codeSource = JsonSchemaExample
          break
        case 'msbSelfDescription':
          this.codeSource = MsbSelfDescriptionExample
          break
        default:
          throw new Error(`Unrecognized source language: ${this.sourceOptions.sourceLanguage}`)
      }

      // redraw the source code editor to reset history
      this.isMyCodeEditorActive = false
      var my = this
      Vue.nextTick(function () {
        my.isMyCodeEditorActive = true
      })

      this.collectOptionsAndConvert()
    },

    // if source language changes, update sample code for source editor
    onSelectTargetLanguageChange () {
      for (var leanguageKey in this.targetLanguages) {
        if (this.targetLanguages[leanguageKey].value === this.targetOptions.targetLanguage) {
          this.targetOptions.targetFormat = this.targetLanguages[leanguageKey].format
        }
      }
      this.collectOptionsAndConvert()
    },

    // generate zip file based on the generated fileSet for the MSB client app
    generateClientZip () {
      let myMsbStudio = new MsbStudio()
      let my = this
      let zipFile: JSZip = new JSZip()

      // add each file from fileSet to the zip file
      for (var fileKey in this.fileSet) {
        var file = this.fileSet[fileKey]
        zipFile.file(file.targetPath + file.fileName, file.content)
      }

      // generate the zip file and provide the download
      zipFile.generateAsync({ type: 'blob' })
        .then(function (content) {
          const url = window.URL.createObjectURL(content)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', myMsbStudio.getName(my.codeSource) + (!my.targetOptions.generateCounterpart ? '_client' : '_client_counterpart') + '.zip') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
    }
  },
  // watch: {
  //   // timeout for loading self description from smart object management
  //   dialogLoadSelfDescriptionFromMsbLoaderActive (val) {
  //     val && setTimeout(() => {
  //       this.dialogLoadSelfDescriptionFromMsbLoaderActive = false
  //     }, 5000)
  //   },
  // },
  beforeDestroy () {

  }
})
</script>

<style lang="scss">
.prism-editor-wrapper{
  height: auto !important;
  font-size: 14px !important;
}
.prism-editor__line-numbers{
  background: black !important;
  font-size: 14px !important;
}
.prism-editor__code{
  background: black !important;
}
.my-code-editor{
  max-height: calc(100vh - 260px);;
  background: black;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.my-code-editor:focus-within{
  border: 1px solid #2196f3;
}
.my-code-editor code{
  width: 100%;
}
.v-application code, .v-application kbd{
  font-weight: normal !important;
}
.my-code-viewer{
  background: black !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.my-code-viewer code{
  background: black !important;
  font-size: 14px !important;
}
.validation-errors{
  overflow: auto;
  width: auto;
  font-size: 14px !important;
}
.validation-errors-editor{
  position: absolute;
  bottom:5px;
  right: 15px;
}
.editor-menu-title{
  font-size: 14px;
  letter-spacing: normal;
  margin-right: 10px;
}
.editor-menu-checkbtn{
  border: 0px solid #ccc !important;
}
.code-genetation-container{
  max-height: calc(100vh - 260px);;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px;
}
.Codeblock-title{
  margin-top: 12px;
  margin-left: 5px;
}
</style>
