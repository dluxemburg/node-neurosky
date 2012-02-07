var nodeThinkGear = require('../node-thinkgear');

var tgClient = nodeThinkGear.createClient({
	appName:'NodeThinkGear',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
});

tgClient.on('data',function(data){
	console.log(data);
});

tgClient.connect();