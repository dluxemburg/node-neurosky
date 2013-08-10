var nodeNeuroSky = require('../lib')
var assert = require("assert")

describe('nodeNeuroSky', function(){
  describe('#createClient()', function(){

    it('should raise an exception when appName is not supplied', function(){
      var probe
      try{
        nodeNeuroSky.createClient()
      }catch(e){
        probe = e
      }
      assert.equal(probe.message, "Must specify appName");
    })

    it('should raise an exception when appKey is not supplied', function(){
      var probe
      try{
        nodeNeuroSky.createClient({
          appName:'MyGreatApp'
        })
      }catch(e){
        probe = e
      }
      assert.equal(probe.message, "Must specify appKey");
    })

    it('should creat a ThinkGearClient client instance', function(){
      assert.equal(nodeNeuroSky.createClient({
        appName:'MyGreatApp',
        appKey:'123456789'
      }).constructor, nodeNeuroSky.ThinkGearClient);
    })
  })
})



