require('dotenv').config();

const express = require("express");
const session = require("express-session");
const expressLayout = require('express-ejs-layouts');
const axios = require("axios");
const multer = require('multer');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const checkAdmin = (req, res, next) => {
  const user = req.user; 

  const isAdmin = user && user.role === 'admin'; 

  res.locals.isAdmin = isAdmin;

  next();
};

app.use(checkAdmin);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
}));


app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
app.use('/', require('./server/routes/login'));
app.use('/', require('./server/routes/news'));
app.use('/', require('./server/routes/alpha'));


app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});

