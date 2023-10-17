var express = require('express');

var app = express();
var server = app.listen(8000, 'localhost', () => {
    console.log('My socket is running.');
});

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

const oscAdressesBlender = [
    '/input1/text',
    '/input2/text',
    '/input3/text',
    '/input4/text',
    '/input5/text'
]

const oscAdressesWaveform = [
    '/3/feedback',
    '/4/blend',
    '/4/center',
    '/4/saturate',
    '/6/quick',
    '/7/quick'
]

const values = [0,0,0,0,0,0]

let feedback = 0;
let blend = 0;
let center = 0;
let saturate = 0;
let quick6 = 0;
let quick7 = 0;



let oscAdress = '';

// FUNCTIONS // _______________________________________________________________

function pickAString(n){
    return Math.floor(Math.random() * (n - 0 + 1)) + 0
}

function handleDataWaveform(socket, emission){
    socket.on(emission, (data) => {
        const index = pickAString(5);
        const adress = oscAdressesWaveform[index];
        const message = new Message(adress);
        data = parseFloat(data);

        values[index] += data/20;
        if (values[index] > 1){
            values[index] = 0;
        }
        message.append(values[index]);
        client2.send(adress, values[index], () => {
            console.log('sending osc message to the adress ' + adress + ': ' + values[index]);
        });
    })
}

function handleDataBlender(socket, emission){
    socket.on(emission, (data) => {
        adress = oscAdressesBlender[pickAString(4)];
        const message = new Message(adress);
        message.append(data);
        client.send(adress, data, () => {
            console.log('sending osc message to the adress ' + adress + ': ' + data);
        });


    })
}

function newConnection(socket){
    console.log('new connection: ' + socket.id);
    handleDataWaveform(socket, 'letterCount');
    
    handleDataBlender(socket, 'textInput');
}

io.sockets.on('connection', newConnection);

'use strict';
const { Client, Message } = require('node-osc');
const client = new Client('127.0.0.1', 8000);

const client2 = new Client('127.0.0.1', 8001);

