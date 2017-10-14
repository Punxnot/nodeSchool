
'use strict';

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

const {renderToStaticMarkup} = require('react-dom/server');

const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create');
const deleteCardController = require('./controllers/cards/delete');
const payByCardController = require('./controllers/cards/pay-by-card');
const getTransactionsController = require('./controllers/transactions/get');
const createTransactionsController = require('./controllers/transactions/create');

const errorController = require('./controllers/error');

const ApplicationError = require('libs/application-error');
const CardsModel = require('source/models/cards');
const TransactionsModel = require('source/models/transactions');

const app = new Koa();

const DATA = {
	user: {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	}
};

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	return require(viewPath);
}

const logger = require('../libs/logger.js')('wallet-app');

// Сохраним параметр id в ctx.params.id
router.param('id', (id, ctx, next) => next());

router.get('/', (ctx) => {
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(DATA));
	ctx.body = indexViewHtml;
});

router.get('/cards/', getCardsController);
router.post('/cards/', createCardController);
router.delete('/cards/:id', deleteCardController);

router.get('/cards/:id/transactions/', getTransactionsController);
router.post('/cards/:id/transactions/', createTransactionsController);

router.post('/card/:id/pay', payByCardController);

router.all('/error', errorController);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();

	await Promise.all([
		ctx.cardsModel.loadFile(),
		ctx.transactionsModel.loadFile()
	]);

	await next();
});

app.use(bodyParser(
	{
	  extendTypes: {
	    json: ['application/x-javascript']
	  }
	}
));
app.use(router.routes());
app.use(serve('./public'));

app.listen(3000, () => {
	logger.log('info', 'Application started');
});
