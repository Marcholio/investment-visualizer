const Client = require('coinbase').Client;

class Api {
  constructor() {
    this.client = new Client({
      'apiKey': 'zW7YD2lZf4nv5vT4',
      'apiSecret': 'i1bOG8HMe1z4933UQkWFkXtsbEi9fe7X',
      'version': '2017-06-28',
      'strictSSL': false
    });
  }

  getSpotPrice(callback) {
    this.client.getSpotPrice({ currencyPair: 'ETH-EUR'}, (err, price) => {
      if (!err) callback(err, price.data.amount);
      else callback(err, null);
    });
  }

  getData(callback) {
    this.client.getAccounts({}, (err, acc) => {
      const accounts = acc.map(a => ({
        balance: a.balance.amount,
        name: a.name,
        currency: a.balance.currency,
      }));
      callback(accounts);
    });
  }
}

module.exports = Api;
