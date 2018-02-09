let AWS = require('aws-sdk');
const sns = new AWS.SNS();
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	console.log(event.queryStringParameters);
	const b64DecodedData = Buffer.from(event.queryStringParameters.data, 'base64').toString();
	console.log(b64DecodedData, "string b64decoded " + b64DecodedData.toString(), "type b64decoded " + typeof b64DecodedData);
	const dataEvent = decodeURI(b64DecodedData);
	console.log(dataEvent, console.log(JSON.parse(dataEvent)))
	console.log("is array? ", Array.isArray(dataEvent));
	for(var prop in JSON.parse(dataEvent)) {
		if(dataEvent.hasOwnProperty(prop)) {
			console.log("property in data event ", prop, dataEvent[prop]);
		}
	}
	console.log(dataEvent.doughnut)
	ddb.get({
		TableName: 'DoughnutInventory',
		Key: { 'type': 'dataEvent.doughnut.type' }
	}, function (err, data) {
		if (err) {
			console.log('oh noeees doughnut fetching error ', err, err.stack)
		} else {
			console.log('yesss doughnuts ', data);
			sns.publish({
				Message: 'I have some type of doughnuts for ya!',
				Subject: 'I have some doughnuts',
				MessageAttributes: {
					'type': {
						DataType: 'String',
						StringValue: 'dataEvent.doughnut.type'
					},
				},
				MessageStructure: 'String',
				TopicArn: 'arn:aws:sns:us-east-1:131603044023:doughnut_shop'
			}).promise()
				.then(data => {
						console.log('yesss doughnuts message sent');
				})
				.catch(err => {
					console.log('noooo doughnuts message sent');
				});
		}
		callback(null, {
			"isBase64Encoded": 1,
			"statusCode": 200,
			"headers": {
				"content-type": "application/json"
			},
			"body": {
				"data": `${dataEvent.doughnut.type} recorded`
			}
		});
	});
}