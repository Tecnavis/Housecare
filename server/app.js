var createError = require('http-errors');
var express = require('express');
const path = require('path');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./config/db');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var housecareRouter = require('./routes/housecare');
var charityRouter = require("./routes/charity");
var adminRouter = require("./routes/admin");
var categoryRouter = require("./routes/category");
var charitystaffRouter = require("./routes/charitystaff");
var benificiaryRouter = require("./routes/benificiary");
var emailRouter = require("./routes/email");
var emailsenderRouter = require("./routes/emailsender");
var smssenderRouter = require("./routes/smssender");
var approvalsRouter = require("./routes/approvals");
var notifications = require('./routes/notification');
var imports = require("./routes/import");
var amount = require("./routes/amount");

connectDB();

var app = express();

// CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    'https://housecare.tecnavis.in',
    'https://housecare-server.onrender.com'  // Add this
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/housecare', housecareRouter);
app.use('/charity', charityRouter);
app.use('/category', categoryRouter);
app.use('/admin', adminRouter);
app.use('/charitystaff', charitystaffRouter);
app.use('/benificiary', benificiaryRouter);
app.use('/email', emailRouter);
app.use('/emailsender', emailsenderRouter);
app.use('/smssender', smssenderRouter);
app.use('/approvals', approvalsRouter);
app.use('/notification', notifications);
app.use('/imports', imports);
app.use('/amount', amount);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Database connected successfully`);
});

module.exports = app;