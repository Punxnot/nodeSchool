'use strict';

const ApplicationError = require('libs/application-error');

const DbModel = require('./common/dbModel');

class Cards extends DbModel {
	constructor() {
		super('card');
	}

	/**
	 * Adds a card
	 *
	 * @param {Object} card описание карты
	 * @returns {Promise.<Object>}
	 */
	async create(card) {
		const isDataValid = card
			&& Object.prototype.hasOwnProperty.call(card, 'cardNumber')
			&& Object.prototype.hasOwnProperty.call(card, 'balance');

		if (isDataValid) {
			const newCard = Object.assign({}, card, {
				id: await this._generateId()
			});

			await this._insert(newCard);
			return newCard;
		}

		throw new ApplicationError('Card data is invalid', 400);
	}

	/**
	 * Deletes a card by id
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = await this.get(id);
		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}
		await this._remove(id);
	}

	/**
	 * Withdraws a sum from a card
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async withdraw(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) - Number(sum);

		await this._update({id}, {balance: newBalance});
	}

	/**
	 * Refills a card by a sum
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async refill(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) + Number(sum);

		await this._update({id}, {balance: newBalance});
	}
}

module.exports = Cards;
