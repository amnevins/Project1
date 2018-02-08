let AWS = require('aws-sdk');
const sns = new AWS.SNS();
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
			sns.publish({
				Message: 'A new doughnut of type ',
				Subject: 'Doughnut Added!',
				MessageAttributes: {
					'type': {
						DataType: 'String',
						StringValue: 'event.doughnut.type'
					}
				},
				MessageStructure: 'String',
				TopicArn: 'arn:aws:sns:us-east-1:131603044023:doughnut_shop'
			}).promise()
				.then(data => {
					console.log('yay message sent ', data);
				})
				.catch(err => {
					console.log('oh noooesss no message sent');
				});
			console.log(`yay doughnut of ${event.doughnut.type} has been stored in inventory`)
		}
	});

	callback(null, 'Successfully executed');
}