var net = require('net'),
	events = require('events'),
	util = require('util')

function NodeNeuroSkyError(message){
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message
  this.name = 'NodeThinkGearError'
}

NodeNeuroSkyError.prototype.__proto__ = Error.prototype

var NeuroSkyClient = function(opts){
	opts || (opts = {})

	this.port = opts.port || 13854
	this.host = opts.host || 'localhost'

	if(typeof(opts.appName) !== 'string') throw new NodeNeuroSkyError('Must specify appName')
	if(typeof(opts.appKey) !== 'string') throw new NodeNeuroSkyError('Must specify appKey')

	this.auth = {
		appName:opts.appName,
		appKey:opts.appKey
	}

	this.config = {
		enableRawOutput: false,
		format: "Json"
	}

	events.EventEmitter.call(this)
}

util.inherits(NeuroSkyClient, events.EventEmitter)

NeuroSkyClient.prototype.connect = function(){
	var self = this

	var client = this.client = net.connect(this.port,this.host,function(){
		client.write(JSON.stringify(self.auth))
	})

	client.on('data',function(data){
		if(!self.configSent){
			self.configSent = true
			client.write(JSON.stringify(self.config))
		} else {
			try{
				self.emit('data',JSON.parse(data.toString()))
			}catch(e){
				self.emit('parse_error',data.toString())
			}
		}
	})

  client.on('error', function(err) {
      console.log('Error connecting to ThinkGear client. Try starting the ThinkGear Connector app.\n', err)
      process.exit(1)
  })
}

exports.NeuroSkyClient = NeuroSkyClient

exports.createClient = function(opts){
	return new NeuroSkyClient(opts || {})
}