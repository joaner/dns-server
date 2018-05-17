const { writeName } = require('./utils');

module.exports = class Response {
  constructor() {
    this.buffer = Buffer.alloc(512)

    this.lengths = {
      header: 12,
      question: null,
    }
  }

  setHeader(header) {
    this.buffer.writeUInt16BE(header.ID, 0)

    let info = 0
    info += header.QR << 15
    info += header.OPCODE << 11 // 4 bits
    info += header.AA << 10 // 1 bit
    info += header.TC << 9 // 1 bit
    info += header.RD << 8 // 1 bit
    info += header.RA << 7 // 1 bit
    info += header.Z << 4 // 3 bits
    info += header.RCODE << 0 // 4 bits
    this.buffer.writeUInt16BE(info, 2)

    this.buffer.writeUInt16BE(header.QDCOUNT, 4)
    this.buffer.writeUInt16BE(header.ANCOUNT, 6)
    this.buffer.writeUInt16BE(header.NSCOUNT, 8)
    this.buffer.writeUInt16BE(header.ARCOUNT, 10)
  }

  setQuestion(question) {
    this.lengths.question = question._BUFFER.length
    this.buffer.fill(question._BUFFER, 12, 12 + this.lengths.question)

    this.hostname = question.QNAME
  }

  setAnswer(answer) {
    let offset = this.lengths.header + this.lengths.question

    const { buffer, length } = writeName(answer.NAME)
    this.buffer.fill(buffer, offset, offset + length)
    offset += length

    this.buffer.writeUInt16BE(answer.TYPE, offset)
    offset += 2

    this.buffer.writeUInt16BE(answer.CLASS, offset)
    offset += 2

    this.buffer.writeUInt32BE(answer.TTL, offset)
    offset += 4

    this.buffer.writeUInt16BE(answer.RDLENGTH, offset)
    offset += 2

    this.buffer.writeUInt8(8, offset++)
    this.buffer.writeUInt8(8, offset++)
    this.buffer.writeUInt8(8, offset++)
    this.buffer.writeUInt8(8, offset++)

    this.buffer = this.buffer.slice(0, offset)
  }
}
