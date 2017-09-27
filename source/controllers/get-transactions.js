'use strict';

const TransactionModel = require('../models/transactions');

module.exports = (ctx) => ctx.body = new TransactionModel().get(ctx.params.id);
