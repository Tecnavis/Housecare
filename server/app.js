var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB =require('./config/db')
var cors =require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var housecareRouter = require('./routes/housecare');
var charityRouter = require("./routes/charity")
var adminRouter = require("./routes/admin")
var categoryRouter = require("./routes/category")
var charitystaffRouter = require("./routes/charitystaff")
var benificiaryRouter = require("./routes/benificiary")
var emailRouter = require("./routes/email")
var approvalsRouter = require("./routes/approvals")
var notifications=require('./routes/notification')
var imports = require("./routes/import")

connectDB()

var app = express();

app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3001",'https://housecare.tecnavis.com'],
  method:["PUT","DELETE","PUSH","GET"],
  credential:true
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/housecare', housecareRouter);
app.use('/charity',charityRouter);
app.use('/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/charitystaff',charitystaffRouter);
app.use('/benificiary',benificiaryRouter);
app.use('/email',emailRouter);
app.use('/approvals',approvalsRouter);
app.use('/notification',notifications);
app.use('/imports',imports)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
