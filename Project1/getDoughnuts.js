let AWS = require('aws-sdk');
const sns = new AWS.SNS();
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	ddb.get({
		TableName: 'DoughnutInventory',
		Key: { 'type': 'event.doughnut.type' }
	}, function (err, data) {
		if (err) {
			console.log('oh noeees doughnut fetching error ', err, err.stack)
			callback(err, err.stack);
		} else {
			console.log('yesss doughnuts ', data);
		
			sns.publish({
				Message: 'I have some type of doughnuts for ya!',
				Subject: 'I have some doughnuts',
				MessageAttributes: {
					'type': {
						DataType: 'String',
						StringValue: 'event.doughnut.type'
					},
				},
				MessageStructure: 'String',
				TopicArn: 'arn:aws:sns:us-east-1:131603044023:doughnut_shop'
			}).promise()
				.then(data => {
						console.log('yesss doughnuts message sent');
							callback(null, data);
				})
				.catch(err => {
					console.log('noooo doughnuts message sent');
					callback(err, err.stack);
				});
		}
	});

	callback(null, 'Successfully executed');
}