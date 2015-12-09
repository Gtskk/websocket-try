// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// WebSocket端口
var webSocketsServerPort = 4001;

var webSocketServer = require('websocket').server;
var http = require('http');
var httpRequest = require('request');

/**
 * Global variables
 */
// 目前连接的用户
var clients = [];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&').replace( / /g, '>').replace(/"/g, '"');
}

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " 服务器监听端口： " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' 来自' + request.host + '的连接.');

    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    console.log((new Date()) + ' 连接建立成功.');

    var host = connection.socket.remoteAddress;
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text

            //console.log((new Date()) + '，信息内容: ' + message.utf8Data);

            // we want to keep history of all sent messages
            var text = htmlEntities(message.utf8Data);

            // 从远程地址获取数据
            var requestPar = {
                url: '数据接口地址'
            };
            httpRequest(requestPar, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    connection.sendUTF(body);
                }
            });
        }
    });

    // 断开连接
    connection.on('close', function(reason) {
        console.log((new Date()) + host + " 断开连接.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
    });

});
