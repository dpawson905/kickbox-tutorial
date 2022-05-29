if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // debug(process.env)
}

const debug = require('debug')('kickbox-tuts:app');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');
const csrf = require('csurf');

const User = require('./models/user');
const DB = process.env.DB_URL;

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const csrfProtection = csrf({ cookie: true });

const app = express();

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => debug("DB connection successful!"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set security HTTP headers
const scriptSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://code.jquery.com',
  'https://unpkg.com',
  'https://kit.fontawesome.com'
];
const styleSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://unpkg.com',
  'https://fonts.googleapis.com'
];
const connectSrcUrls = [
  'https://ka-f.fontawesome.com'
];
const frameSrcUrls = [];
const fontSrcUrls = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://ka-f.fontawesome.com'
];
const imgSrcUrls = [
  'https://robohash.org'
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", ...frameSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sess = {
  name: 'xoco',
  secret: process.env.SECRET,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: 'Strict'
  },
  store: MongoDBStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 3600,
    crypto: {
      secret: process.env.SECRET,
    },
  }),
  resave: true,
  saveUninitialized: false,
};

if (app.get('env') === 'production') {
  app.set('trust proxy', true); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(flash());
app.use(session(sess));
app.use(csrfProtection);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.title = 'Kickbox Tutorial';
  res.locals.csrfToken = req.csrfToken();
  res.locals.token = req.query.token;
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.all('*', (err, req, res, next) => {
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  debug(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
