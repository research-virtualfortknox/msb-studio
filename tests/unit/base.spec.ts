import { expect } from 'chai'
// @ts-ignore
import MsbSelfDescriptionUtil from '@/utility/MsbSelfDescriptionUtil'
import {
  MsbSelfDescriptionExample
} from '@/components/examples-for-editor-source'

describe('MsbSelfDescriptionUtil', () => {
  var myMsbSelfDescriptionUtil: MsbSelfDescriptionUtil

  before(function () {
    myMsbSelfDescriptionUtil = new MsbSelfDescriptionUtil(MsbSelfDescriptionExample)
  })

  it('get basic settings from self description', () => {
    expect(myMsbSelfDescriptionUtil.getType()).to.equal('Application')
    expect(myMsbSelfDescriptionUtil.getUuid()).to.equal('d33880ce-fb3f-44a4-b407-0993e123456')
    expect(myMsbSelfDescriptionUtil.getName()).to.equal('MySampleApp')
    expect(myMsbSelfDescriptionUtil.getDescription()).to.equal('This is my sample application generated by MSB Studio')
    expect(myMsbSelfDescriptionUtil.getToken()).to.equal('1233e25ba567')
  })
})
