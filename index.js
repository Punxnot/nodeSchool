const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const validator = require('./libs/validate-credit-card');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
		</body>
	</html>`);
});

app.get('/error', (req, res) => {
	throw Error('Oops!');
});

app.get('/cards', (req, res) => {
	fs.readFile('source/cards.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  const obj = JSON.parse(data);
		res.send(obj);
	});
});

app.post('/cards', function(req, res) {
	req.headers['content-type'] = 'application/json';
	fs.readFile('source/cards.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  let existed = JSON.parse(data);
		// Check if the card number is valid
		if (validator.validateCreditCard(req.body.cardNumber)) {
			existed.push(req.body);
			existed = JSON.stringify(existed);
			fs.writeFile("source/cards.json", existed);
			res.send("The file was saved!");
		} else {
			res.status(400).send('Card number not valid');
		}
	});
});

app.delete('/cards/:id', (req, res) => {
	req.headers['content-type'] = 'application/json';
	fs.readFile('source/cards.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  let existed = JSON.parse(data);
		if (existed[req.params.id]) {
			existed.splice(req.params.id, 1);
			existed = JSON.stringify(existed);
			fs.writeFile("source/cards.json", existed);
			res.send("The file was deleted!");
		} else {
			res.status(404).send('404 Card not found');
		}
	});
});

app.get('/transfer', (req, res) => {
	const {amount, from, to} = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	});
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
