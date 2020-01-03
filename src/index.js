/* eslint-disable no-console */
const app = require('./app');

require('./kafka');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
