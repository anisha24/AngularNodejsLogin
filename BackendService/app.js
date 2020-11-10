var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var loggers = require('./logger');

var auth = require('./auth/routes/routes')

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
	loggers.log(
		'info',
		`${req.protocol} ${req.method} ${req.originalUrl} "res":{"statuscode": ${res.statusCode}},"req":{"url":${req.url},"method":${req.method},"httpVersion":${req.httpVersion},"originalUrl":${req.originalUrl},"httpVersion":${req.httpVersion},"query":${JSON.stringify(
			req.query
		)},"protocol":${req.protocol} } `
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Origin: *');
	} else {
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	}
	next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', auth);

module.exports = app;
