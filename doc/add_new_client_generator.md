# How to add a new Client Code Generator

This is a short introduction about how to add a new client code generator.

## Implement the Generator class

You can find the existing client code generators in ``utility/generators``.

To add a new one ...
* Add a new generator class and extend it from ``utility/generators/MsbClientGenerator.js``
* Use an existing generators as blueprint (e.g. the class ``MsbClientGeneratorNode.js``)

## Add the template project

The generator class uses the MSB Selfdescription to update the files of a template project. Therefore the template engine [EJS](https://ejs.co/) is used.
* Add your new template project to ``utility/templates``
* Add EJS template language to your template files (use EJS syntax of existing template projects as blueprint)

## Activate you new Generator in MSB Studio UI

MSB Studio UI is based on VueJS.

Add support for your client generator to ``utility/MsbStudio.js``. 
Add your target language:
```js
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
```

Add support for your client generator target language by updating ``components/CodeGenerator.vue``.

Is your target language present?
```js
    let targetLanguages = [
      { text: 'NodeJs', value: 'JavaScript', format: 'js' },
      { text: 'Python', value: 'Python', format: 'python' },
      { text: 'Java', value: 'Java', format: 'java' },
      { text: 'C++', value: 'C++', format: 'c' },
      { text: 'C#', value: 'C#', format: 'csharp' },
      { text: 'Json Schema', value: 'schema', format: 'json' }
    ]
```

Update ``convertMsbSelfDescriptionToClient`` method to enable your target language:
```js
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
```

## Verify your new Code Generator

Now you are ready to verify and debug your new generator class:
- Open MSB Studio
- Test different msb selfdescription samples
- Check the UI output for your template project
- Donwload your generated template project and test it