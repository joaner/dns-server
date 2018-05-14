const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const Request = require('./request')

console.log(Request)

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`)
  server.close();
})

server.on('message', (buf, rinfo) => {
  console.log(`message from ${rinfo.address}:${rinfo.port}`)

  const request = new Request(buf)
  console.info(request.getHeader());

  console.info('query: ' + request.getQuestion())
})

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(53)
