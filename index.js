const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const Router = require('koa-router');
const serve = require('koa-static');
const fs = require('fs');
const validator = require('./libs/validate-credit-card');

const app = new Koa();
const router = new Router();

app.use(bodyParser);
app.use(router.routes());
app.use(serve(__dirname + '/public'));

const readFile = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', function (err, data) {
		  if (err) return reject(err);
		  resolve(JSON.parse(data));
		});
  });
};

const checkCard = (cardsList, cardNumber) => {
	for (let i=0; i<cardsList.length; i++) {
		if (cardsList[i].cardNumber === cardNumber) {
			return i;
		}
	}
	return false;
};

router.get('/', (ctx) => {
	ctx.body = `<!doctype html>
	<html>
		<head>
			<link rel="stylesheet" href="/style.css">
		</head>
		<body>
			<h1>Hello Smolny!</h1>
		</body>
	</html>`;
});

router.get('/cards', async function (ctx) {
  ctx.body = await readFile('source/cards.json');
});

router.get('/error', async function (ctx) {
	throw new Error('Oops!');
});

router.post('/cards', async function (ctx) {
	try {
		// Check if the card number is valid
		if (validator.validateCreditCard(ctx.request.body.cardNumber)) {
			let content = await readFile('source/cards.json');
			content.push(ctx.request.body);
			content = JSON.stringify(content);
			fs.writeFile("source/cards.json", content);
			ctx.body = "File was saved";
		} else {
			const err = new Error('Card number not valid');
  		ctx.status = 400;
			ctx.body = "400 Card number not valid";
		}
	} catch (err) {
		throw new Error(err);
	}
});

router.delete('/cards/:id', async function (ctx) {
	try {
		let content = await readFile('source/cards.json');
		if (content[ctx.params.id]) {
			content.splice(ctx.params.id, 1);
			content = JSON.stringify(content);
			fs.writeFile("source/cards.json", content);
			ctx.body = "The card was deleted!";
		} else {
			res.status(404).send('404 Card not found');
		}
	} catch (err) {
		throw new Error(err);
	}
});

router.get('/transfer', async function (ctx) {
	try {
		let content = await readFile('source/cards.json');
		const {amount, from, to} = ctx.request.query;
		const cardInd1 = checkCard(content, from);
		const cardInd2 = checkCard(content, to);
		if (cardInd1 >= 0 && cardInd2 >= 0 && parseInt(amount)) {
			content[cardInd1].balance = parseInt(content[cardInd1].balance) - parseInt(amount) + "";
			content[cardInd2].balance = parseInt(content[cardInd2].balance) + parseInt(amount) + "";
			content = JSON.stringify(content);
			fs.writeFile("source/cards.json", content);
			ctx.body = `Success: $${amount} was transfered from card ${from} to card ${to}`;
		} else {
			const err = new Error('Invalid data');
  		ctx.status = 400;
			ctx.body = "400 No such card/cards or the amount is zero";
		}
	} catch (err) {
		throw new Error(err);
	}
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
