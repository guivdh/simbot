var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const fs = require('file-system');
const bcrypt = require('bcrypt');
const http = require('http');
const https = require('https');

var privateKey = fs.readFileSync('/etc/letsencrypt/live/simbot.space/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/simbot.space/fullchain.pem');

var credentials = {key: privateKey, cert: certificate};


var connection = mysql.createConnection({
	host     : '51.77.201.156',
	user     : 'guivdh',
	password : 'BKD6Vccy9SPRx56k',
	database : 'nodelogin'
});

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static('public'));


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
	response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		sql = "SELECT * FROM nodelogin.accounts WHERE username = ?"
		connection.query(sql, [username], function(error, results, fields) {
			console.log(results.length)
			if(results.length == 0){
				response.send('Incorrect Username and/or Password! Please reconnect to <a href="login">simbot.space</a>');
			}
			else{
				bcrypt.compare(password, results[0]['password'], function(err, res) {
					if(res == false) {
						response.send('Incorrect Username and/or Password!');
					} else {
						request.session.loggedin = true;
						request.session.username = username;
						response.redirect('/home');
					}
					response.end();
				});
			}

		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/nbrBots', function (request, response) {
	if (request.session.loggedin) {
		connection.query("SELECT count(id) as 'nbrRobots' from master.bot;", function (err, result, fields) {
			if (err) throw err;
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(result));
		});
	} else {
		response.send('Veuillez vous <a href="/login">connecter</a> pour accèder à ce contenu');
	}
})

app.get('/requests', function (request, response) {
	if (request.session.loggedin) {
		connection.query("SELECT * from master.request;", function (err, result, fields) {
			if (err) throw err;
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(result));
		});
	} else {
		response.send('Veuillez vous <a href="/login">connecter</a> pour accèder à ce contenu');
	}
})

app.get('/requestsToday', function (request, response) {
	if (request.session.loggedin) {
		var now = new Date();
		var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var timestamp = startOfDay / 1000;
		var sql = "SELECT count(id) FROM master.request WHERE master.request.requestDate >= ?;"
		connection.query(sql, [timestamp], function (err, result, fields) {
			if (err) throw err;
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(result));
		});
	} else {
		response.send('Veuillez vous <a href="/login">connecter</a> pour accèder à ce contenu');
	}
})

app.get('/logout', function (req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
		console.log('Session terminée')
	})
})

app.get('/graph', function (req, res) {
	if (req.session.loggedin) {
		data =fs.readFileSync('./content/graph.html', 'utf8');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.send(data);
	} else {
		res.send('Veuillez vous <a href="/login">connecter</a> pour accèder à ce contenu');
	}
	res.end();
})

app.get('/login', function (req, res) {
	res.sendFile(path.join(__dirname + '/login.html'));
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		data =fs.readFileSync('./content/index.html', 'utf8');
		response.send(data);
	} else {
		response.send('Veuillez vous <a href="/login">connecter</a> pour accèder à ce contenu');
	}
	response.end();
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443);
httpServer.listen(443);