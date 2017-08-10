import sha512 from 'sha512';

class Api {
  constructor() {
    this.key = 'e97fe6b756fc4f9f94708cdca2edb091';
    this.secret = 'ef1e1c97c5a74e4bbaaf4e0b1f18668f';
    this.baseUrl = 'https://bittrex.com/api/v1.1/';
  }

  query(url) {
    const nonce = new Date().getTime();
    const uri = `${url}?apikey=${this.key}&nonce=${nonce}`;
    const sign = sha512.hmac(this.secret).finalize(uri).toString('hex');
    unirest.get(uri)
      .headers({
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        apisign: sign })
      .end(res => console.log(res));
  }

  publicQuery(endpoint) {
    const url = `${this.baseUrl}public/${endpoint}`;
    this.query(url);
  }

  privateQuery(endpoint) {
    const url = `${this.baseUrl}private/${endpoint}`;
    this.query(url);
  }
}

export default Api;
