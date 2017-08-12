const cors = require('cors-anywhere');

cors.createServer({}).listen(process.env.HOST || 'localhost', 8080, () => console.log('Proxy running'));
