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
    this.state = { coinbase: [], bittrex: [] };
  }

  componentDidMount() {
    this.coinbase.getData()
      .then(data =>
        this.setState({
          coinbase: data,
        }),
      );
    this.bittrex.publicQuery('getmarkets');
  }

  render() {
    const coinbaseData = CoinbaseParser(this.state.coinbase);
    return (
      <div className="App" style={{ padding: '24px' }}>
        <DataBox name={'Coinbase'} rows={coinbaseData} logo={CoinbaseLogo} color={'#0b74c5'} />
      </div>
    );
  }
}

export default App;
