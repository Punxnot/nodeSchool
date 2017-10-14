'use strict';

const ApplicationError = require('libs/application-error');

const FileModel = require('./common/fileModel');

class Cards extends FileModel {
	constructor() {
		super('cards.json');
	}

	/**
	 * Adds a new card
	 *
	 * @param {Object} card card details
	 * @returns {Promise.<Object>}
	 */
	async create(card) {
		const isDataValid = card
			&& Object.prototype.hasOwnProperty.call(card, 'cardNumber')
			&& Object.prototype.hasOwnProperty.call(card, 'balance');

		if (isDataValid) {
			const newCard = Object.assign({}, card, {
				id: this._generateId()
			});

			this._dataSource.push(newCard);
			await this._saveUpdates();
			return newCard;
		}

		throw new ApplicationError('Card data is invalid', 400);
	}

	/**
	 * Deletes a card
	 * @param {Number} id card id
	 */
	async remove(id) {
		const card = await this.get(id);
		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}
		const cardIndex = this._dataSource.indexOf(card);
		this._dataSource.splice(cardIndex, 1);
		await this._saveUpdates();
	}
	
	/**
	 * Transfers money from one card to another
	 * @param {Number} amount amount to transfer
	 * @param {Number} id from-card id
	 * @param {Number} id to-card id
	 */
	// transfer (amount, from, to) {
	//   const fromCard = this._dataSource.find((item) => {
	//     return item.cardNumber == from;
	//   });
	//   const toCard = this._dataSource.find((item) => {
	//     return item.cardNumber == to;
	//   });
	//   fromCard.balance = parseInt(fromCard.balance) - parseInt(amount) + "";
	//   toCard.balance = parseInt(toCard.balance) + parseInt(amount) + "";
	//   await this._saveUpdates();
	// }

	/**
	 * Withdraws an amount from a card
	 * @param {Number} id card id
	 * @param {Number} amount amount to withdraw
	 */
	async payBy(id, amount) {
		const card = await this.get(id);
		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		} else if (!card.balance || card.balance == "0") {
			throw new ApplicationError("Zero balance", 401);
		} else {
			card.balance = parseInt(card.balance) - parseInt(amount) + "";
			await this._saveUpdates();
			return card;
		}
	}
}

module.exports = Cards;
