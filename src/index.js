const dgram = require('dgram')
const server = dgram.createSocket('udp4')

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`)
  server.close();
})

server.on('message', (buf, rinfo) => {
  console.log(`server got: ${buf.toString('hex')} from ${rinfo.address}:${rinfo.port}`)

  const question = buf.slice(12);

  const domain = [];

  let start = 0
  let length
  while (length = question.readUInt8(start)) {
    const end = start + 1 + length
    const part = question.slice(start, end)
    domain.push(part.toString('utf8'))

    start = end
  }

  console.log(`query ${domain.join('.')}`)
})

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(53)
