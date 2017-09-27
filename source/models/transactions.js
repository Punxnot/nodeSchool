'use strict';

const fs = require('fs');
const path = require('path');
const ApplicationError = require('../../libs/application-error');
const DATA_SOURCE = path.join(__dirname, '..', 'transactions.json');

class Transactions {
	constructor () {
		this._dataSource = require(DATA_SOURCE);
	}

	get (cardId) {
    const result = this._dataSource.filter((item) => {
			return item.cardId == cardId;
		});
		return result;
	}

	create (transactionData) {
    transactionData.id = this._dataSource.length + 1;
    this._dataSource.push(transactionData);
    this._saveUpdates();
    return transactionData;
	}

	async _saveUpdates () {
		await fs.writeFile(DATA_SOURCE, JSON.stringify(this._dataSource, null, 4));
	}
}

module.exports = Transactions;
