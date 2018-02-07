let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	ddb.put({
		TableName: 'DoughnutInventory',
		Item: { 'type': event.doughnut.type }
	}, function (err, data) {
		if (err) {
			console.log('oh noeees', err, err.stack);
			callback(err, err.stack)
		} else {
			console.log(`yay doughnut of ${event.doughnut.type} has been stored in inventory`)
		}
	});

	callback(null, 'Successfully executed');
}