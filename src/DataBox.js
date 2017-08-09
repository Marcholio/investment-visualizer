import React from 'react';
import { Card, Image, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class DataBox extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
          {rowData.eur}
        </Table.Cell>
      </Table.Row>
    );

    return (
      <div className={'col-lg-3 col-md-4 col-sm-6 col-xs-12'}>
        <Card fluid>
          <Card.Header style={{ backgroundColor: this.props.color, padding: '8px' }}>
            <Image src={this.props.logo} style={{ maxHeight: '20px' }} />
          </Card.Header>
        </Card>
        <Table striped style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', borderCollapse: 'unset', border: '1px solid #CCC' }}>
          <Table.Body>
            {this.props.rows.map(createRow)}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

DataBox.propTypes = {
  logo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default DataBox;
