'use strict';

const CardsModel = require('../../models/cards');

module.exports = (ctx) => ctx.body = new CardsModel().getAll();
