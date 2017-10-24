'use strict';

const ApplicationError = require('libs/application-error');

const DbModel = require('./common/dbModel');

class Transactions extends DbModel {
	constructor() {
		super('transaction');
	}

	/**
	 * Adds transaction
	 *
	 * @param {Object} transaction
	 * @returns {Promise.<Object>}
	 */
	async create(transaction) {
		const newTransaction = Object.assign({}, transaction, {
			id: await this._generateId()
		});
		
		await this._insert(newTransaction);
		return newTransaction;
	}

	/**
	 * Gets transactions by card id
	 * @param {Number} cardId
	 * @return {Promise.<Object[]>}
	 */
	async getByCard(cardId) {
		const item = await this.getBy({cardId});
		return item;
	}

	/**
	 * Deletes transaction by id
	 */
	static async remove() {
		throw new ApplicationError('Transaction can\'t be removed', 400);
	}
}

module.exports = Transactions;
