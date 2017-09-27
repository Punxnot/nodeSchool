'use strict';

const CardsModel = require('../../models/cards');
const validator = require('../../../libs/validate-credit-card');

module.exports = (ctx) => {
	const card = ctx.request.body;
	try {
		if (validator.validateCreditCard(ctx.request.body.cardNumber)) {
			const cardsModel = new CardsModel();
			const newCard = cardsModel.create(card);
			ctx.body = "File was saved";
		} else {
			ctx.status = 400;
			ctx.body = "400 Card number not valid";
		}
	} catch (err) {
    ctx.status = err.status;
    ctx.body = err.status + " Card creation error";
	}
};
