const Client = require('coinbase').Client;

class Api {
  constructor() {
    this.client = new Client({
      apiKey: 'zW7YD2lZf4nv5vT4',
      apiSecret: 'i1bOG8HMe1z4933UQkWFkXtsbEi9fe7X',
      version: '2017-06-28',
      strictSSL: false,
    });
  }

  getSpotPrice(currency) {
    return new Promise((resolve, reject) => {
      this.client.getSpotPrice({ currencyPair: `${currency}-EUR` }, (err, price) => {
        if (!err) resolve(price.data.amount);
        else reject(err);
      });
    });
  }

  getData() {
    return new Promise((resolve) => {
      this.client.getAccounts({}, (err, acc) => {
        const accounts = acc.map(a => (
          a.balance.currency !== 'EUR' ?
            this.getSpotPrice(a.balance.currency)
              .then(price =>
                ({
                  balance: a.balance.amount,
                  name: a.name,
                  currency: a.balance.currency,
                  eur: Math.round(price * a.balance.amount * 100) / 100.0,
                }))
            :
            ({
              balance: a.balance.amount,
              name: a.name,
              currency: a.balance.currency,
              eur: a.balance.amount,
            })
        ));
        Promise.all(accounts)
          .then((data) => { resolve(data); });
      });
    });
  }
}

export default Api;
