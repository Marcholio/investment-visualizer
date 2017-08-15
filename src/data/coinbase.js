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
        if (!err) resolve(parseFloat(price.data.amount));
        else reject(err);
      });
    });
  }

  getBalances() {
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
              eur: parseFloat(a.balance.amount),
            })
        ));
        Promise.all(accounts)
          .then((data) => { resolve(data.filter(d => d.balance > 0)); });
      });
    });
  }

  getInvestedValue() {
    return new Promise((resolve) => {
      this.client.getAccounts({}, (error, accounts) => {
        const data = accounts.map(a =>
          new Promise(resolveTxs =>
            a.getTransactions({}, (err, txs) => resolveTxs({ name: a.name, data: txs }))));
        Promise.all(data)
          .then((txs) => {
            const investments = txs.map((t) => {
              let currentEur = 0;
              let currentAmount = 0;
              t.data.reverse().forEach((d) => {
                const amount = parseFloat(d.amount.amount);
                if (currentAmount !== 0) {
                  const multiplier = amount / currentAmount;
                  currentAmount += amount;
                  currentEur += currentEur * multiplier;
                } else {
                  currentEur = parseFloat(d.native_amount.amount);
                  currentAmount = amount;
                }
              });
              return currentEur;
            });
            const total = investments.reduce((a, b) => a + b, 0);
            resolve(total);
          });
      });
    });
  }
}

export default Api;
