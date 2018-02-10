let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log(event);
	console.log(event.body);

	const errorCallback = {
		"statusCode": 500,
		"headers": {
			"content-type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		"body": JSON.stringify({
			"data": 'oops we got problems'
		})
	}
	const successCallback = {
		"statusCode": 200,
		"headers": {
			"content-type": "application/json",
			"Access-Control-Allow-Origin": "*"
		},
		"body": JSON.stringify({
			'data': 'doughnut recorded'
		})
	}
	ddb.put({
		TableName: 'DoughnutInventory',
		Item: { 'type': JSON.parse(event.body).doughnut.type }
	}, function (err, data) {
		if (err) {
			console.log('error putting to table ', err, err.stack)
			callback(null, errorCallback);
		} else {
			console.log('da data is ', data);
			callback(null, successCallback);
		}
	});

}