'use strict';

const TransactionModel = require('../models/transactions');
const validTypes = ["paymentMobile", "prepaidCard", "card2Card"];

const isTransactionValid = (transactionData) => {
  return transactionData && transactionData.hasOwnProperty('cardId') && transactionData.hasOwnProperty('type') && transactionData.hasOwnProperty('data') && transactionData.hasOwnProperty('time') && transactionData.hasOwnProperty('sum') && validTypes.indexOf(transactionData.type) >= 0;
};

module.exports = async (ctx) => {
	const transactionData = ctx.request.body;
	try {
		if (isTransactionValid(transactionData)) {
			const transactionModel = new TransactionModel();
			const newTransaction = await transactionModel.create(transactionData);
			ctx.body = "Transaction was saved";
		} else {
			ctx.status = 400;
			ctx.body = "400 Transaction data not valid";
		}
	} catch (err) {
    ctx.status = err.status;
    ctx.body = err.status + " Transaction creation error";
	}
};
