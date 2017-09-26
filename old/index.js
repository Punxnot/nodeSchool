const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const validator = require('./libs/validate-credit-card');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Error!');
});

const readFile = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', function (err, data) {
		  if (err) return reject(err);
		  resolve(JSON.parse(data));
		});
  });
};

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
	readFile('source/cards.json').then((existed) => {
		res.send(existed);
	}, (reason) => {
		throw reason;
	})
});

app.post('/cards', function(req, res) {
	req.headers['content-type'] = 'application/json';
	readFile('source/cards.json').then((existed) => {
		// Check if the card number is valid
		if (validator.validateCreditCard(req.body.cardNumber)) {
			existed.push(req.body);
			existed = JSON.stringify(existed);
			fs.writeFile("source/cards.json", existed);
			res.send("The file was saved!");
		} else {
			res.status(400).send('400 Card number not valid');
		}
	}, (reason) => {
		throw reason;
	});
});

app.delete('/cards/:id', (req, res) => {
	req.headers['content-type'] = 'application/json';
	readFile('source/cards.json').then((existed) => {
			if (existed[req.params.id]) {
				existed.splice(req.params.id, 1);
				existed = JSON.stringify(existed);
				fs.writeFile("source/cards.json", existed);
				res.send("The card was deleted!");
			} else {
				res.status(404).send('404 Card not found');
			}
	}, (reason) => {
		throw reason;
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
