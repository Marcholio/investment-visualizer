const cors = require('cors-anywhere');

cors.createServer({}).listen(process.env.PORT || 8080, () => console.log('Proxy running'));
