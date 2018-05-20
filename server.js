const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const Request = require('./src/request')
const Build = require('./src/build')

process.title = process.env.npm_package_name;

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`)
  server.close();
})

server.on('message', (buf, rinfo) => {
  console.log(`message from ${rinfo.address}:${rinfo.port}`)

  const request = new Request(buf)
  const { header, questions } = request.execute()

  header.QR = 1
  header.RD = 1

  const response = new Build()
  const question = questions[0]
  const answer = {
    NAME: question.QNAME,
    TYPE: question.QTYPE,
    CLASS: question.QCLASS,
    TTL: 3600,
    RDLENGTH: 4,
    RDATA: Buffer.from([8, 8, 8, 4]),
  }
  response.execute({
    header,
    questions,
    answers: [answer],
  })

  server.send(response.buffer, rinfo.port, rinfo.address)
})

server.on('listening', () => {
  const address = server.address()
  console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(53)
