const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
require('dotenv').config();

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

//Allows you to access session objects from handlerbars template. Eg. {{session.user_id}}
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize
  .sync({
    alter: process.env.ENVIRONMENT == 'Dev',
    force: process.env.ENVIRONMENT == 'Dev-Rebuild',
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Now listening (env: ${process.env.ENVIRONMENT})...`)
    );
  });
