'use strict';

const fs = require('fs');
const path = require('path');

const ApplicationError = require('../../libs/application-error');

const DATA_SOURCE = path.join(__dirname, '..', 'cards.json');

class Cards {
	constructor () {
		this._dataSource = require(DATA_SOURCE);
	}

	getAll () {
		return this._dataSource;
	}

	create (card) {
		const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance');
		if (isDataValid) {
			card.id = this._dataSource.length + 1;
			this._dataSource.push(card);
			this._saveUpdates();
			return card;
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	remove (id) {
		const card = this._dataSource.find((item) => {
			return item.id == id;
		});

		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}

		const cardIndex = this._dataSource.indexOf(card);
		this._dataSource.splice(cardIndex, 1);
		this._saveUpdates();
	}

  transfer (amount, from, to) {
    const fromCard = this._dataSource.find((item) => {
			return item.cardNumber == from;
		});
    const toCard = this._dataSource.find((item) => {
			return item.cardNumber == to;
		});
    fromCard.balance = parseInt(fromCard.balance) - parseInt(amount) + "";
    toCard.balance = parseInt(toCard.balance) + parseInt(amount) + "";
    this._saveUpdates();
  }

	async _saveUpdates () {
		await fs.writeFile(DATA_SOURCE, JSON.stringify(this._dataSource, null, 4));
	}
}

module.exports = Cards;
