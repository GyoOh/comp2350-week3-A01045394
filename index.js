const mysql = require('mysql');
const http = require('http');
const process = require('process')
const port = process.env.PORT || 3000;

const dbConfigHeroku = {
	host: "i0rgccmrx3at3wv3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	user: "vktbaxbkg7ang30j",
	password: "nevso5emlc7kk276",
	database: "ise2puc82ou4khhn",
	multipleStatements: false,
	reconnect: true
};
const dbConfigLocal = {
	host: "localhost",
	user: "root",
	password: "skdisk12",
	database: "test_relationships_g_oh",
	multipleStatements: false,
	reconnect: true
};
const connection = process.env.IS_HEROKU == undefined ? dbConfigLocal : dbConfigHeroku;

// const connection = null;
// if (process.env.IS_HEROKU == undefined) {
//  connection = dbConfigLocal;
// } else {
//  connection = dbConfigHeroku;
// }

var database = mysql.createPool(connection);

database.getConnection((err, dbConnection) => {
	if (!err) {
		console.log("Successfully connected to MySQL");
	}
	else {
		console.log("Error Connecting to MySQL");
		console.log(err);
	}
});


http.createServer(function(req, res) {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			//Send an HTTP Status code of 500 for server error.
			res.writeHead(500, {'Content-Type': 'text/html'});
			//write the HTML
			res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
			console.log("Error connecting to mysql");
		}
		else {
			dbConnection.query("SHOW VARIABLES LIKE 'version';", (err, result) => {
				if (err) {
					//Send an HTTP Status code of 500 for server error.
					res.writeHead(500, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					//Send an HTTP Status code of 200 for success!
					res.writeHead(200, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Connected to the database, check the Heroku logs for the results.</div></body></html>');

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
}).listen(port);

