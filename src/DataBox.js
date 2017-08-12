import React from 'react';
import { Card, Image, Table, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
            {`${result} %`}
          </Table.Cell>
      );
    };

    return (
      <div className={'col-lg-4 col-md-6 col-xs-12'}>
        <Card fluid>
          <Card.Header style={{ backgroundColor: this.props.color, padding: '8px', display: 'flex', justifyContent: 'center' }}>
            <Image src={this.props.logo} style={{ maxHeight: '20px' }} />
          </Card.Header>
        </Card>
        {this.props.invested !== -1 ?
          <Table striped style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', borderCollapse: 'unset', border: '1px solid #CCC' }}>
            <Table.Body>
              {this.props.rows.map(createRow)}
            </Table.Body>
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
        :
          <div style={{
            height: '100px',
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
