var neurosky = require('../lib')
var assert = require("assert")

describe('neurosky', function(){
  describe('#createClient()', function(){

    it('should raise an exception when appName is not supplied', function(){
      var probe
      try{
        neurosky.createClient()
      }catch(e){
        probe = e
      }
      assert.equal(probe.message, "Must specify appName")
    })

    it('should raise an exception when appKey is not supplied', function(){
      var probe
      try{
        neurosky.createClient({
          appName:'MyGreatApp'
        })
      }catch(e){
        probe = e
      }
      assert.equal(probe.message, "Must specify appKey")
    })

    it('should creat a ThinkGearClient client instance', function(){
      assert.equal(neurosky.createClient({
        appName:'MyGreatApp',
        appKey:'123456789'
      }).constructor, neurosky.NeuroSkyClient)
    })
  })
})



