/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/database.json');
const middlewares = jsonServer.defaults();
const db = require('./database.json');
const fs = require('fs');
server.use(middlewares);
server.use(jsonServer.bodyParser);
