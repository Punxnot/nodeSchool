'use strict';

// Fill card balance via mobile phone
module.exports = async (ctx) => {
  const cardId = Number(ctx.params.id);
	const amount = ctx.request.body.amount + "";
  await ctx.cardsModel.payBy(cardId, amount);
	ctx.body = "Paid successfully";
	ctx.status = 200;
};
