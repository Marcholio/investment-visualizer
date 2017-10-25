import React from 'react';
import styled from 'styled-components';
import { Card, Image, Table, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-collapse: unset;
  border: 2px solid #CCC;
  border-top: none;
  margin: 0;
`;

const ScrollContainer = styled.div`
  height: 173px;
  overflow: auto;
  width: 100%;
`;

class DataBox extends React.Component {
  constructor(props) {
    super(props);

    const total = props.rows.map(r => r.eur).reduce((a, b) => a + b, 0);

    this.state = { total };
  }

  componentWillReceiveProps(nextProps) {
    const total = nextProps.rows.map(r => r.eur).reduce((a, b) => a + b, 0);
    this.setState({ total });
  }

  render() {
    const createRow = rowData => (
      <Table.Row key={rowData.title}>
        <Table.Cell>
          {rowData.title}
        </Table.Cell>
        <Table.Cell>
          {rowData.amount}
        </Table.Cell>
        <Table.Cell>
          {`${rowData.eur} EUR`}
        </Table.Cell>
      </Table.Row>
    );

    const profit = (amount) => {
      const result = Math.round(((amount / this.props.invested) - 1) * 1000) / 10;
      return (
        this.props.invested < amount ?
          <Table.Cell style={{ color: 'green' }}>
            {`+${result}%`}
          </Table.Cell>
          :
          <Table.Cell style={{ color: 'red' }}>
            {`${result}%`}
          </Table.Cell>
      );
    };

    return (
      <div className={'col-lg-3 col-md-4 col-sm-6 col-xs-12'} style={{ margin: '8px 0' }}>
        <Card fluid style={{ margin: 0 }}>
          <Card.Header style={{ backgroundColor: this.props.color, padding: '8px', display: 'flex', justifyContent: 'center' }}>
            <Image src={this.props.logo} style={{ maxHeight: '20px' }} />
          </Card.Header>
        </Card>
        {this.props.invested !== -1 ?
          <Wrapper>
            <ScrollContainer>
              <Table
                unstackable
                striped
              >
                <Table.Body>
                  {this.props.rows.filter(r => r.eur > 0.1).map(createRow)}
                </Table.Body>
              </Table>
            </ScrollContainer>
            <Table unstackable style={{ margin: 0 }}>
              <Table.Footer fullWidth style={{ backgroundColor: '#F2F2F2', fontWeight: '700' }}>
                <Table.Row>
                  <Table.Cell />
                  <Table.Cell>
                    {`${Math.round(this.state.total * 100) / 100} EUR`}
                  </Table.Cell>
                  {profit(this.state.total)}
                </Table.Row>
              </Table.Footer>
            </Table>
          </Wrapper>
        :
          <div style={{
            height: '219px',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            borderCollapse: 'unset',
            border: '1px solid #CCC',
          }}
          >
            <Loader active size={'large'} style={{ marginTop: '24px' }} />
          </div>
        }
      </div>
    );
  }
}

DataBox.propTypes = {
  logo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  invested: PropTypes.number.isRequired,
};

export default DataBox;
