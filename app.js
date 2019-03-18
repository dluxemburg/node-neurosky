var neurosky = require('./lib')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/* 
    To Run the program, use: `node app.js UserName_DateTime` 
    where `UserName_DateTime` is Folder Name where data needs to be stored
*/

// Read Command Line Arguments for getting DateTime and Username
const args = process.argv;
var userFolderName = args[2];
var payload = {};

console.log(userFolderName);

const csvWriter = createCsvWriter({
	path: '../../Reports/' + userFolderName + '/' + userFolderName + '_EEG.csv',
	header: [
        { id: 'time', title: 'DATETIME' },
        { id: 'delta', title: 'DELTA' },
        { id: 'theta', title: 'THETA' },
        { id: 'la', title: 'LOW ALPHA' },
        { id: 'ha', title: 'HIGH ALPHA' },
        { id: 'lb', title: 'LOW BETA' },
        { id: 'hb', title: 'HIGH BETA' },
        { id: 'lg', title: 'LOW GAMMA' },
        { id: 'hg', title: 'HIGH GAMMA' },
        {id: 'attention', title: 'ATTENTION'},
        { id: 'relaxed', title: 'RELAXED' },
		{ id: 'stressed', title: 'STRESSED' }
	]
});


var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

function saveRecord(records) {
    csvWriter.writeRecords(records) // returns a promise
        .then(() => {
            console.log('...writing to csv');
            return Promise.resolve();
        });

    process.on('unhandledRejection', up => { console.log(up) })
}

function newRecord(datetime, data, incoming_var) {
    if(incoming_var === 'eSense'){
        // if data is received, save a copy in payload
        payload.datetime = datetime;
        payload.delta = data.eegPower.delta;
        payload.theta =  data.eegPower.theta,
        payload.la= data.eegPower.lowAlpha,
        payload.ha= data.eegPower.highAlpha,
        payload.lb= data.eegPower.lowBeta,
        payload.hb= data.eegPower.highBeta,
        payload.lg= data.eegPower.lowGamma,
        payload.hg= data.eegPower.highGamma,
        payload.attention= data.eSense.attention,
        payload.relaxed= data.eSense.meditation,
        payload.stressed= 100 - data.eSense.meditation
        return [
            {
                time: datetime,
                delta: data.eegPower.delta,
                theta: data.eegPower.theta,
                la: data.eegPower.lowAlpha,
                ha: data.eegPower.highAlpha,
                lb: data.eegPower.lowBeta,
                hb: data.eegPower.highBeta,
                lg: data.eegPower.lowGamma,
                hg: data.eegPower.highGamma,
                attention: data.eSense.attention,
                relaxed: data.eSense.meditation,
                stressed: 100 - data.eSense.meditation
            }
        ];    
    }else if(incoming_var === 'blinkStrength'){
        // if blink is caught, use previously saved `payload` data
        return [
            {
                time: payload.datetime,
                delta: payload.delta,
                theta: payload.theta,
                la: payload.la,
                ha: payload.ha,
                lb: payload.lb,
                hb: payload.hb,
                lg: payload.lg,
                hg: payload.hg,
                attention: payload.attention,
                relaxed: payload.relaxed,
                stressed: 100 - payload.relaxed
            }
        ];    
    }else{
        return [
            {
                time: datetime,
                delta: 0,
                theta: 0,
                la: 0,
                ha: 0,
                lb: 0,
                hb: 0,
                lg: 0,
                hg: 0,
                attention: 0,
                relaxed: 0,
                stressed: 0
            }
        ];    
    }


}

client.on('data', function (data) {
	// Capture Date and Time
	var datetime = new Date();
	console.log(datetime)
	console.log(data)

    if(data.eSense){
        // Store incoming stream of data as a record
        let records = newRecord(datetime, data, 'eSense');

        // Write record to CSV file
        saveRecord(records);
    }else if(data.blinkStrength){
        // Store incoming stream of data as a record
        let records = newRecord(datetime, data, 'blinkStrength');

        // Write record to CSV file
        saveRecord(records);
    }else{
        // Store incoming stream of data as a record
        let records = newRecord(datetime, data, 'status');

        // Write record to CSV file
        saveRecord(records);
    }

	console.log("\n");
});

client.on('error', function (error) {
    console.log(error);
});


client.connect();