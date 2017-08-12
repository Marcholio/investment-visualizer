import React from 'react';

import CoinbaseClient from './data/coinbase';
import CoinbaseParser from './parsers/coinbase';
import CoinbaseLogo from './logos/coinbase.png';

import BittrexClient from './data/bittrex';
import DataBox from './DataBox';

import './styles/App.css';

class App extends React.Component {
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
    this.bittrex.publicQuery('getmarkets');
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
      <div className="App" style={{ padding: '24px' }}>
        {createBox(this.state.coinbase)}
      </div>
    );
  }
}

export default App;
