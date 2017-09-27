'use strict';

const CardsModel = require('../../models/cards');

module.exports = async (ctx) => {
	try {
		const cardsModel = new CardsModel();
		await cardsModel.remove(ctx.params.id);
		ctx.body = "Card was deleted";
	} catch (err) {
    ctx.status = err.status;
    ctx.body = err.status + " Card deletion error";
	}
};
