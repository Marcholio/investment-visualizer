import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import CoinbaseClient from './data/coinbase';
import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.coinbase = new CoinbaseClient();
    this.state = { coinbase: { meta: { name: 'Coinbase' }, data: []} };
  }

  componentDidMount() {
    this.coinbase.getData(data => this.setState({ coinbase: { meta: this.state.coinbase.meta , data }}));
  }

  render() {
    return (
      <div className="App">
        <ReactGridLayout.Responsive isResizable={false} isDraggable={false} width={1000}>
          <div key={1}>Työ</div>
          <div key={2}>Maa</div>
        </ReactGridLayout.Responsive>
      </div>
    );
  }
}

export default App;
