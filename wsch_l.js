/*
 * wsch_l.js - websocket connection handler that keeps a listing of all active connections
 *
 * @author Alexandre Bintz
 * dec. 2014
 */

"use strict";

var rWebSocketConnectionHandler = require('./wsch');

/**
 * WebSocketConnectionHandler
 *
 * @constructor
 */
function WebSocketConnectionHandler() {
  rWebSocketConnectionHandler.call(this);

  this.connections = {};
  this.connectionsNumber = 0;
}
WebSocketConnectionHandler.prototype = Object.create(rWebSocketConnectionHandler.prototype);

/**
 * WebSocketConnectionHandler - initial action on new connection
 *
 * @param {WebSocketConnection} pConnection - websocket connection
 *
 * @return {mixed} an object than can be used to identify the connection later
 */
WebSocketConnectionHandler.prototype.newConnection = function(pConnection) {

  var handle = this.generateConnectionHandle(pConnection);

  this.registerConnection(handle, pConnection);

  this.connectionsNumber++;

  return handle;
}

/**
 * WebSocketConnectionHandler - connection close
 *
 * remove connection from listing
 *
 * @param {string} pConnectionHandle - connection handle
 */
WebSocketConnectionHandler.prototype.onClose = function(pConnectionHandle) {

  this.removeConnection(pConnectionHandle);

  this.connectionsNumber--;
}

/**
 * WebSocketConnectionHandler - generates connection handle
 *
 * @param {WebSocketConnection} pConnection - websocket connection
 *
 * @return {string} the connection handle
 */
WebSocketConnectionHandler.prototype.generateConnectionHandle = function(pConnection) {

  return this.connectionsNumber + 1;
}

/**
 * WebSocketConnectionHandler - add new connection to listing
 *
 * @param {string}              pConnectionHandle - connection handle
 * @param {WebSocketConnection} pConnection       - websocket connection
 */
WebSocketConnectionHandler.prototype.registerConnection = function(pConnectionHandle, pConnection) {

  this.connections[pConnectionHandle] = pConnection;
}

/**
 * WebSocketConnectionHandler - remove connection from listing
 *
 * @param {string} pConnectionHandle - connection handle
 */
WebSocketConnectionHandler.prototype.removeConnection = function(pConnectionHandle) {

  this.connections[pConnectionHandle] = undefined;
}

/**
 * WebSocketConnectionHandler - retrieve connection from handle
 *
 * @param {string} pConnectionHandle - connection handle
 *
 * @return {WebSocketConnection} the connection object
 */
WebSocketConnectionHandler.prototype.getConnection = function(pConnectionHandle) {

  return this.connections[pConnectionHandle];
}

/**
 * WebSocketConnectionHandler - connection message
 *
 * echoes back received message
 *
 * @param {string} pConnectionHandle - connection handle
 * @param {string} pMessage          - raw message object
 */
WebSocketConnectionHandler.prototype.onMessage = function(pConnectionHandle, pMessage) {

  this.getConnection(pConnectionHandle).send(pMessage.utf8Data);
}


/* exports
 */
module.exports = WebSocketConnectionHandler;
