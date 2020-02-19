const express = require('express');
const router = express.Router();
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.on('connect', function () {
  client.subscribe('dadosPorta', function (err) {
    if (!err) {
      client.publish('dadosPorta', 'Dados:')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})

module.exports = router;   