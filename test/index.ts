import WebSocket from 'ws'

const socket = new WebSocket('ws://1.14.246.248:6700/event')

socket.on('message', data => {
  console.log(data.toString())
})
