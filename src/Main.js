import React from 'react';

import CoinbaseClient from './data/coinbase';
import CoinbaseParser from './parsers/coinbase';
import CoinbaseLogo from './logos/coinbase.png';

import BittrexClient from './data/bittrex';
import BittrexParser from './parsers/bittrex';
import BittrexLogo from './logos/bittrex.png';

import WalletParser from './parsers/wallet';
import WalletLogo from './logos/wallet.png';

import DataBox from './DataBox';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.coinbase = new CoinbaseClient();
    this.bittrex = new BittrexClient();
    this.state = {
      coinbase: {
        data: [],
        invested: -1,
        logo: CoinbaseLogo,
        color: '#0b74c5',
      },
      bittrex: {
        data: [],
        invested: -1,
        logo: BittrexLogo,
        color: '#29323d',
      },
      wallet: {
        data: [],
        invested: -1,
        logo: WalletLogo,
        color: '#ff9900',
      },
    };
  }

  componentDidMount() {
    Promise.all([
      this.coinbase.getBalances(),
      this.coinbase.getInvestedValue(),
    ]).then(results =>
        this.setState({
          coinbase: Object.assign(
            this.state.coinbase,
            {
              data: CoinbaseParser(results[0]),
              invested: results[1],
            }),
        }),
      );

    Promise.all([
      this.bittrex.getBalances(),
      this.coinbase.getSpotPrice('BTC'),
      this.bittrex.getInvestedValue(),
    ]).then(results =>
      this.setState({
        bittrex: Object.assign(
          this.state.bittrex,
          {
            data: BittrexParser(results[0], results[1]),
            invested: results[2] * results[1],
          }),
      }),
    );

    Promise.all([
      this.bittrex.getWithdrawals(),
      this.bittrex.getSpotPrice('BTC-NEO'),
      this.coinbase.getSpotPrice('BTC'),
    ]).then(results =>
      this.setState({
        wallet: Object.assign(
          this.state.wallet,
          {
            data: WalletParser(results[0], results[1].Last, results[2]),
            invested: 2100,
          }),
      }),
    );
  }

  render() {
    const createBox = values => (
      <DataBox
        rows={values.data}
        invested={values.invested}
        logo={values.logo}
        color={values.color}
      />);
    return (
      <div>
        {createBox(this.state.coinbase)}
        {createBox(this.state.bittrex)}
        {createBox(this.state.wallet)}
      </div>
    );
  }
}

export default Main;
