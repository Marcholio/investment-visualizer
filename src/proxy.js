const cors = require('cors-anywhere');

cors.createServer({}).listen(8080, () => console.log('Proxy running'));
