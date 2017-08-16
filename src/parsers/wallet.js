import Immutable from 'immutable';


const addresses = Immutable.Map({
  NEO: 'AQUWew9yFoASGCypyPTJCjaR2JffQ9tLGF',
});

const Parser = (actions, neoToBtc, btcToEur) => {
  const neoTotal = actions.filter(a => a.Address === addresses.get('NEO'))
                    .reduce((sum, a) => sum + parseFloat(a.Amount), 0);
  return [
    { title: 'NEO Wallet',
      amount: `${Math.round(neoTotal * 1000) / 1000} NEO`,
      eur: Math.round(neoTotal * neoToBtc * btcToEur * 100) / 100,
    },
  ];
};


export default Parser;
