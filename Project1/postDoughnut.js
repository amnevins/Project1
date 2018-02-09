let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log(event);
	console.log(event.body);
	ddb.put({
		TableName: 'DoughnutInventory',
		Item: { 'type': dataEvent }
	}, function (err, data) {
		if (err) {
			console.log('error putting to table ', err, err.stack)
			callback(errorCallback);
		} else {
			console.log(data);
			callback(null, successCallback);
		}
	});

	const errorCallback = {
		"isBase64Encoded": 1,
		"statusCode": 500,
		"headers": {
			"content-type": "application/json"
		},
		"body": {
			"data": `oops we got problems`
		}
	}
	const successCallback = {
		"isBase64Encoded": 1,
		"statusCode": 200,
		"headers": {
			"content-type": "application/json"
		},
		"body": {
			"data": `${dataEvent.doughnut.type} recorded`
		}
	}
	callback(null, successCallback);
}