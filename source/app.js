'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const Router = require('koa-router');
const serve = require('koa-static');
const fs = require('fs');
const validator = require('../libs/validate-credit-card');
const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create-card');
const deleteCardController = require('./controllers/cards/delete-card');
const transferController = require('./controllers/cards/transfer');
const errorController = require('./controllers/error');

const getTransactionsController = require('./controllers/transactions/get-transactions');
const createTransactionController = require('./controllers/transactions/create-transaction');

const app = new Koa();
const router = new Router();

app.use(bodyParser);
app.use(router.routes());
app.use(serve(__dirname + '/public'));


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

router.get('/cards', getCardsController);
router.post('/cards', createCardController);
router.delete('/cards/:id', deleteCardController);
router.all('/error', errorController);
router.get('/transfer', transferController);

router.get('/cards/:id/transactions', getTransactionsController);
router.post('/cards/:id/transactions', createTransactionController);

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
