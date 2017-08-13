
const Parser = (accounts, btcPrice) => (
  accounts.map(a => ({
    title: `${a.currency} Wallet`,
    amount: `${Math.round(1000 * a.balance) / 1000} ${a.currency}`,
    eur: Math.round(100 * parseFloat(btcPrice) * a.btc) / 100,
  }))
);

export default Parser;
