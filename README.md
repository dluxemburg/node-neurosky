#node-thinkgear

Client library for the [ThinkGear Socket Protocol](http://developer.neurosky.com/docs/lib/exe/fetch.php?media=app_notes:thinkgear_socket_protocol.pdf) from [NeuroSky](http://neurosky.com/). 

###You'll need one of [these](http://store.neurosky.com/products/mindwave-1):

![Fashion!](http://danielluxemburg.com/mindwave.png)

###Usage

Install with NPM:

```
$ npm install node-thinkgear
```


Include the module:

```javascript
var nodeThinkGear = require('node-thinkgear');
```

Create a client instance:

```javascript
var tgClient = nodeThinkGear.createClient({
	appName: 'My Great Application',
	appKey: '1234567890abcdef...'
});
```

Add a listener for incoming data:

```javascript
tgClient.on('data',function(data){
	
	// magical and wonderful things

});
```

Connect to the headset:

```javascript
tgClient.connect();
```

All of this is in the `example/app.js` file too.

###Data

The output objects look like this:

```javascript
{ 
	eSense: { 
		attention: 53, 
		meditation: 47 
	},
	eegPower: { 
		delta: 416474,
		theta: 33592,
		lowAlpha: 3877,
		highAlpha: 3142,
		lowBeta: 1569,
		highBeta: 3125,
		lowGamma: 3521,
		highGamma: 1451 
	},
	poorSignalLevel: 0 
}
```

With the occasional `{ blinkStrength: 55 }` when you blink.

###TO DO

- Some tests
- A more thorough example
- Deal with raw output
- Make different types of device signal emit different events
