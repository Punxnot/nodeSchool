var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/nodeschool";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	db.createCollection("transactions", function(err, res) {
		if (err) throw err;
		console.log("Collection created!");
		db.close();
	});
});