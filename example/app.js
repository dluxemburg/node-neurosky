var neurosky = require('../lib')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: '../data/output.csv',
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
        { id: 'meditation', title: 'MEDITATION' }
	]
});


var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

client.on('data', function (data) {
	// Capture Date and Time
	var datetime = new Date();
	console.log(datetime)
	console.log(data)

	// Store incoming stream of data as a record
	let records = newRecord(datetime, data);

	// Write record to CSV file
	saveRecord(records);

	console.log("\n")
});

client.connect()

function saveRecord(records) {
        csvWriter.writeRecords(records) // returns a promise
            .then(() => {
                console.log('...writing to csv');
                return Promise.resolve();
        });

    process.on('unhandledRejection', up => { console.log(up) })
}

function newRecord(datetime, data) {
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
            meditation: data.eSense.meditation
        }
    ];
}
