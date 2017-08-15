
const Parser = props => (
  props.map(a => ({
    title: a.name,
    amount: `${Math.round(1000 * a.balance) / 1000} ${a.currency}`,
    eur: a.eur,
  }))
);

export default Parser;
