
const Parser = props => (
  props.map(a => ({
    title: a.name,
    amount: `${a.balance} ${a.currency}`,
    eur: '0 EUR',
  }))
);

export default Parser;
