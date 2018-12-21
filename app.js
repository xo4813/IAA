const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const ColorHash = require('color-hash');
require('dotenv').config();

const webSocket = require('./socket');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchList = require('./routes/searchList');
const statChart = require('./routes/statChart');
const posting = require('./routes/posting');
const commentsRouter = require('./routes/comments');

const passportConfig = require('./passportConfig')

const connect = require('./schemas');

const app = express();
passportConfig(passport);

var Account = require('./schemas/account');

var cookieSession = require('cookie-session');

connect();
// const passport = require('./lib/passport')(app);

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8005);

// console.log(`여기`)
// console.log(`여기앱${app}`)
// const passported = require('./lib/passport')(app)
// console.log(`여기앱${passported}`)

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
// console.log('왜?');

// app.use(cookieSession({
//   keys: ['node_yun'],
//   cookie: {
//     maxAge: 1000 * 60 * 60
//   }
// }))
console.log(`왜?1`)
// var passport = require('passport'),
// LocalStrategy = require('passport-local').Strategy,
// GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log('왜?2')

//   console.log('왜?3')
//   passport.serializeUser(function (user, done) {
//     done(null, user)
//     console.log(`user ${user} serializeUser 호출부분`)
//   });
//   console.log('왜?4')
//   passport.deserializeUser(function (user, done) {
//     done(null, user);
//     console.log(`user ${user} deserializeUser 호출부분`)
//   });
//   console.log('왜?4')
//   next();
// });

// passport.use(new LocalStrategy({
//   usernameField: "accountId",
//   passwordField: "accountPwd",
//   passReqToCallback: true
// }, function (req, username, password, done) {
//   console.log('LocalStrategy아래 함수 호출 위치는 lib/passport.js')
//   Account.findOne({ type: accountId }, function (err, findAccountId) {
//     if (username === findAccountId && password === findAccountId.accountPwd) {
//       console.log('맞음')
//       return done(null, {
//         'user_id': username,
//       })
//     } else {
//       console.log('틀림')
//       return done(false, null)
//     }
//   })
//   console.log('왜?5')
// }))

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/statCharts', statChart);
app.use('/postings', posting);
app.use('/searchLists', searchList);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server, app, sessionMiddleware);
