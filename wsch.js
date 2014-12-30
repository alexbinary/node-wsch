/*
 * wsch.js - generic websocket connection handler
 *
 * @author Alexandre Bintz
 * dec. 2014
 */

"use strict";

/**
 * WebSocketConnectionHandler
 *
 * @constructor
 */
function WebSocketConnectionHandler() {
}

/**
 * WebSocketConnectionHandler - handle a new connection
 *
 * @param {WebSocketConnection} pConnection - websocket connection
 */
 WebSocketConnectionHandler.prototype.handleConnection = function(pConnection) {

  console.log('initializing new websocket connection');
  console.log({
    'remoteAddress': pConnection.remoteAddress,
    'version':       pConnection.webSocketVersion,
    'protocol':      pConnection.protocol,
    'extensions':    pConnection.extensions
  });

  var connectionHandle = this.newConnection(pConnection);

  var _this = this;

  pConnection.on('message', function(pMessageRaw) {

    console.log('websocket message:');
    console.log(pMessageRaw);

    if(typeof _this.onMessage == 'function') {
      _this.onMessage(connectionHandle, pMessageRaw);
    }
  });

  pConnection.on('close', function(pCode, pReason) {

    console.log('websocket connection closed: ' + pCode + ': ' + pReason);

    if(typeof _this.onClose == 'function') {
      _this.onClose(connectionHandle, pCode, pReason);
    }
  });

  pConnection.on('error', function(pError) {

    console.log('websocket connection error: ' + pError);

    if(typeof _this.onError == 'function') {
      _this.onError(connectionHandle, pError);
    }
  });

  if(typeof this.onConnectionReady == 'function') {
    this.onConnectionReady(connectionHandle);
  }
}

/**
 * WebSocketConnectionHandler - initial action on new connection
 *
 * default implementation does nothing and returns the connection itself
 *
 * @param {WebSocketConnection} pConnection - websocket connection
 *
 * @return {WebSocketConnection} the connection itself
 */
WebSocketConnectionHandler.prototype.newConnection = function(pConnection) {

  return pConnection;
}

/* exports
 */
module.exports = WebSocketConnectionHandler;
