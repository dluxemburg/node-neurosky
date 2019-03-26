var neurosky = require('./lib')
var dateFormat = require('dateformat');
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
	path: '../../Reports/' + userFolderName + '/raw/' + userFolderName + '_EEG.csv',
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
        { id: 'stressed', title: 'STRESSED' },
        { id: 'blinkStrength', title: 'BLINK'}
	]
});


var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})


client.connect();


function saveRecord(records) {
    csvWriter.writeRecords(records) // returns a promise
        .then(() => {
            console.log('...writing to csv');
            return Promise.resolve();
        });

    process.on('unhandledRejection', up => { console.log(up) })
}


function newEEGRecord(datetime, data){
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
            stressed: 100 - data.eSense.meditation,
            blinkStrength: 0
        }
    ];    
}


function newBlankRecord(datetime){
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
            stressed: 0,
            blinkStrength: 0
        }
    ];
}


function newBlinkRecord(datetime, data){
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
            stressed: 0,
            blinkStrength: data.blinkStrength
        }
    ];
}


client.on('data', function (data) {
	// Capture Date and Time
    var now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	console.log(now);
	console.log(data);

    if(data.eSense){
        // Store incoming stream of data as a record
        let records = newEEGRecord(now, data);
        payload = data;

        // Write record to CSV file
        saveRecord(records);
    }else if(data.blinkStrength){
        // Store incoming stream of data as a record
        let records = newBlinkRecord(now, data);

        // Write record to CSV file
        saveRecord(records);
    }else{
        // Store incoming stream of data as a record
        let records = newBlankRecord(now);

        // Write record to CSV file
        saveRecord(records);
        sleep(1000);
    }
	console.log("\n");
});


client.on('error', function (error) {
    console.log(error);
});