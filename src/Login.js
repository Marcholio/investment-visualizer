import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sha512 from 'sha512';
import { Input, Button } from 'semantic-ui-react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: 'space-between';
  width: 25%;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { password: '' };
    this.hash = '6e8daeaf9d05bc632460bbd6bdfc36d82bb2d5416a123e61c4e276980444ec5acb4ff15b9ee872e000fca227ed5ee8f9befd5d3acaa8f8ac2be5ba5bbb260de8';
  }

  render() {
    return (
      <Wrapper>
        <Input type={'password'} value={this.state.password} onChange={event => this.setState({ password: event.target.value })} />
        <Button
          onClick={() =>
            this.props.submit(sha512(this.state.password).toString('hex') === this.hash)}
        >
          Kirjaudu
        </Button>
      </Wrapper>
    );
  }
}

Login.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default Login;
