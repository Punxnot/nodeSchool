'use strict';

module.exports = async (ctx) => {
  try {
    const {amount, from, to} = ctx.request.query;
    await ctx.cardsModel.transfer(amount, from, to);
    ctx.body = `Success: $${amount} was transfered from card ${from} to card ${to}`;
  } catch (err) {
    ctx.status = err.status;
    ctx.body = err.status + " Transfer error";
  }
};
