const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const Request = require('./src/request')

process.title = process.env.npm_package_name;

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`)
  server.close();
})

server.on('message', (buf, rinfo) => {
  console.log(`message from ${rinfo.address}:${rinfo.port}`)

  const request = new Request(buf)
  console.info(request.getHeader())
  console.info(request.getQuestion())
})

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(53)
