
# Wsch

Simple websocket connection handler for `websocketserverhelper` package.

This module is designed to work with the [`websocketserverhelper`](https://www.npmjs.com/package/websocketserverhelper) package.
It provides two objects that can be used as connection handler with the `Server` object.
The objects are very simple and not really useful used alone.
They are designed to be configured, extended and inherited from.
See below for more infos.

This module is good for experimenting and quick prototyping due to its easy setup and convenient log output.
However it might not be suited when precise configurations, performances, or security are required.


# Minimalistic example

```javascript
var Wsch = require('wsch').Wsch;
var handler = new Wsch;
handler.onMessage = function(connection, message) {
  connection.send(message.utf8Data);
};
var wsServer = require('websocketserverhelper').createServer(['echo'], handler);
wsServer.start(36521);
```


# Module documentation

The module exports two objects :
- `Wsch` : a basic connection handler
- `Wschl` : same as `Wsch` but maintains a listing of the active connections

Both objects provide several hooks that can be used to extend the default behavior.
The functions listed for each object below can be either set as properties
or redefined in objects that inherit from the object :

```javascript
// set as property
var handler = new (require('wsch').Wsch);
handler.functionName = function(...) {...};

// redefined in object that inherits from the object
var Wsch = require('wsch').Wsch;
function MyHandler() { Wsch.call(this); }
MyHandler.prototype = Object.create(Wsch.prototype);
MyHandler.prototype.functionName = function(...) {...};
```


# 'Wsch' object

The `Wsch` object does nothing apart from some logging output.
The following hooks can be used to extend the default behavior :

### newConnection(connection)

This functions is called for each new connection, before any processing occurs.

`connection` is the connection object as received by the `handleConnection` function.

This function must return an object that will be used to identify the connection.
This is called the *connection handle*.
All hooks expect a connection handle when they have to work on a connection.
The connection handle can be of any type (string, number, object). It can be the connection object itself.

The default implementation of this function does nothing and returns the connection object itself as the handle.

### onConnectionReady(connectionHandle)

This function is called when a new connection has been processed and is ready to be used.
This can be used to send initial data, or start a data reception service.

### onClose(connectionHandle, code, reason)

This function is called when the connection is closed, either locally or remotely.
`code` is the close code, see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Close_codes  
`reason` is a human readable string explaining why the connection was closed.

### onError(connectionHandle, error)

This function is called when the connection encounters an error.
When this is the case `onClose` is also called.

### onMessage(connectionHandle, messageRaw)

This function is called when the connection receives data.
`messageRaw` is an object representing the message that looks like this :

```javascript
// For Text Frames:
{
  type: "utf8",
  utf8Data: "A string containing the received message."
}

// For Binary Frames:
{
  type: "binary",
  binaryData: binaryDataBuffer // a Buffer object containing the binary message payload
}
```


# 'Wschl' object

The `Wschl` object is the same as `Wsch` but it also maintains a listing of all currently open connections.

`Wschl` inherits from `Wsch` and is thus built on top of it.

The following methods can be redefined to change the default behavior.
When you redefine a method you can use the properties that `Wschl` uses internally.

NB: `Wschl` uses some of the hooks provided by `Wsch`. For this reason it is not
recommended to use them when working with `Wschl`. These are :
newConnection(), onClose(). Other hooks can be used safely.

## Properties

### connections

Object that contains the currently open connections.

### connectionsNumber

Number of currently open connections.

## Methods

### generateConnectionHandle(connection)

This function takes a connection object and returns a connection handle.

The default implementation returns the value of `connectionsNumber` property plus one.

Redefine it to customize the connection handles.

### registerConnection(connectionHandle, connection)

This function adds a connection to the listing using the given handle.

The default implementation adds a property to the `connections` property using the connection handle as the property name and the connection as the value.

Redefine it to customize the way connections are stored in the listing or if you want to use a different form of listing.

### removeConnection(connectionHandle)

This function removes a connection from the listing.

The default implementation sets the value of the `connections` property's property whose name is the connection handle to `undefined`.

You should redefine it if you redefined `registerConnection()`.

### getConnection(connectionHandle)

This function retrieves a connection from the listing using the given handle.

The default implementation returns the value of the `connections` property's property whose name is the connection handle.

You should redefine it if you redefined `registerConnection()`.


# Infos

`websocketserverhelper` package : https://www.npmjs.com/package/websocketserverhelper


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments and suggestions are welcome.
