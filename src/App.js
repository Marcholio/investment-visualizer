import React from 'react';

import CoinbaseClient from './data/coinbase';
import CoinbaseParser from './parsers/coinbase';
import DataBox from './DataBox';
import CoinbaseLogo from './logos/coinbase.png';

import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.coinbase = new CoinbaseClient();
    this.state = { coinbase: [] };
  }

  componentDidMount() {
    this.coinbase.getData(data =>
      this.setState({
        coinbase: data,
      }),
    );
  }

  render() {
    const coinbaseData = CoinbaseParser(this.state.coinbase);
    return (
      <div className="App">
        <DataBox name={'Coinbase'} rows={coinbaseData} logo={CoinbaseLogo} color={'#0b74c5'} />
      </div>
    );
  }
}

export default App;
