import React from 'react';
import Main from './Main';
import Login from './Login';

import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { auth: false };
  }

  render() {
    return (
      <div className="App">
        { this.state.auth ?
          <Main />
        :
          <Login submit={auth => this.setState({ auth })} />
        }
      </div>
    );
  }
}

export default App;
