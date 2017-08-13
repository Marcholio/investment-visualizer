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
}

export default Api;
