const express = require('express');
const auth = require("./middlewares/auth")
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const routes = require('./routes');

const initHandlebars = require('./config/handlebars');
const initDatabase = require('./config/database');

initHandlebars(app);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth());

app.use('/static', express.static(path.resolve(__dirname, './static')))
app.use(routes);

initDatabase(config.DB_CONNECTION_STRING)
  .then(() => {
    app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}...`));
  })
  .catch(err => {
    console.log(err);;
  })
