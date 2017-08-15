import sha512 from 'sha512';
import axios from 'axios';

class Api {
  constructor() {
    this.key = 'e97fe6b756fc4f9f94708cdca2edb091';
    this.secret = 'ef1e1c97c5a74e4bbaaf4e0b1f18668f';
    this.baseUrl = 'https://bittrex.com/api/v1.1/';
  }

  query(url, params) {
    const nonce = new Date().getTime();
    const uri = `${url}?apikey=${this.key}&nonce=${nonce}&${params}`;
    const sign = sha512.hmac(this.secret).finalize(uri).toString('hex');
    const corsRequestUri = `${uri.slice(8).split('/')[0]}:443/${uri.slice(8).split('/').slice(1).join('/')}`;

    // Use proxy server to get around cors issues
    return axios.get(`https://fast-journey-36020.herokuapp.com/${corsRequestUri}`,
      { headers: { apisign: sign } },
    ).then(res => res.data.result);
  }

  getSpotPrice(market) {
    const url = `${this.baseUrl}public/getticker`;
    return this.query(url, `market=${market}`);
  }

  getBalances() {
    const url = `${this.baseUrl}account/getBalances`;
    return new Promise(resolve =>
      this.query(url, '')
        .then((res) => {
          const balances = res.map(a =>
            new Promise((resolveBalance) => {
              if (a.Currency !== 'BTC') {
                this.getSpotPrice(`BTC-${a.Currency}`)
                  .then(result => resolveBalance({
                    currency: a.Currency,
                    balance: a.Balance,
                    btc: a.Balance * result.Last,
                  }));
              } else {
                resolveBalance({
                  currency: a.Currency,
                  balance: a.Balance,
                  btc: a.Balance,
                });
              }
            }),
          );
          return Promise.all(balances)
            .then(balanceRes => resolve(balanceRes));
        }),
      );
  }

  getDeposits() {
    const url = `${this.baseUrl}account/getdeposithistory`;
    return this.query(url, '');
  }

  getWithdrawals() {
    const url = `${this.baseUrl}account/getwithdrawalhistory`;
    return this.query(url, '');
  }

  getTransactions() {
    const url = `${this.baseUrl}account/getorderhistory`;
    return this.query(url, '');
  }

  getInvestedValue() {
    return new Promise(resolve =>
      Promise.all([
        this.getDeposits(),
        this.getWithdrawals(),
        this.getTransactions(),
      ]).then((res) => {
        const deposits = res[0].reduce((map, d) => {
          if (map[d.Currency]) {
            return Object.assign(map, { [d.Currency]: map[d.Currency] + d.Amount });
          }
          return Object.assign(map, { [d.Currency]: d.Amount });
        }, { });

        const withdrawals = res[1].reduce((map, d) => {
          if (map[d.Currency]) {
            return Object.assign(map, { [d.Currency]: map[d.Currency] + d.Amount });
          }
          return Object.assign(map, { [d.Currency]: d.Amount });
        }, { });

        const changes = Object.keys(withdrawals).reduce((map, key) => {
          if (map[key]) {
            return Object.assign(map, { [key]: map[key] - withdrawals[key] });
          }
          return Object.assign(map, { [key]: -1 * withdrawals[key] });
        }, deposits);

        const results = res[2].reduce((map, t) => {
          const isBuy = t.OrderType.includes('BUY');
          const currencies = t.Exchange.split('-');
          const source = isBuy ? currencies[0] : currencies[1];
          const target = isBuy ? currencies[1] : currencies[0];
          const sourceObj =
            map[source] ?
              { [source]: map[source] - t.Price }
            :
              { [source]: -1 * t.Price };
          const targetObj =
            map[target] ?
              { [target]: map[target] + t.Quantity }
            :
              { [target]: t.Quantity };
          return Object.assign(map, sourceObj, targetObj);
        }, changes);

        const pricePromises = Object.keys(results)
          .map(k => new Promise(resolvePrice =>
            this.getSpotPrice(`BTC-${k}`)
            .then(p => resolvePrice({ [k]: p }),
          )));

        Promise.all(pricePromises)
          .then((prices) => {
            const priceMap = prices.reduce((map, p) => Object.assign(map, p), {});
            resolve(Object.keys(results).reduce((sum, k) => {
              if (k === 'BTC') {
                return sum + results[k];
              }
              return sum + (results[k] * parseFloat(priceMap[k].Last));
            }, 0));
          });
      }),
    );
  }
}

export default Api;
