const { writeName } = require('./utils');

module.exports = class Build {
  constructor() {
    this.buffer = Buffer.alloc(512)

    this.offset = 0
  }

  /**
   * build
   */
  execute({ header, questions, answers, authoritys, additionals }) {
    header.QDCOUNT = questions.length
    header.ANCOUNT = answers.length
    this.setHeader(header)

    this.buildSections(questions, this.setQuestion)

    this.buildSections(answers, this.setResource)
    this.buildSections(authoritys, this.setResource)
    this.buildSections(additionals, this.setResource)

    this.buffer = this.buffer.slice(0, this.offset)
    return this.buffer
  }

  /**
   * build multi section
   * @param {Array} sections
   * @param {Function} fn
   */
  buildSections(sections, fn) {
    if (!(sections instanceof Array)) {
      return
    }
    sections.forEach((section) => {
      fn.call(this, section)
    })
  }

  setHeader(header) {
    this.buffer.writeUInt16BE(header.ID, this.offset)

    let info = 0
    info += header.QR << 15
    info += header.OPCODE << 11 // 4 bits
    info += header.AA << 10 // 1 bit
    info += header.TC << 9 // 1 bit
    info += header.RD << 8 // 1 bit
    info += header.RA << 7 // 1 bit
    info += header.Z << 4 // 3 bits
    info += header.RCODE << 0 // 4 bits
    this.buffer.writeUInt16BE(info, this.offset += 2)

    this.buffer.writeUInt16BE(header.QDCOUNT, this.offset += 2)
    this.buffer.writeUInt16BE(header.ANCOUNT, this.offset += 2)
    this.buffer.writeUInt16BE(header.NSCOUNT, this.offset += 2)
    this.buffer.writeUInt16BE(header.ARCOUNT, this.offset += 2)
  }

  setQuestion(question) {
    const { buffer, length } = writeName(question.QNAME)
    this.buffer.fill(buffer, this.offset, this.offset + length)
    this.offset += length

    this.buffer.writeUInt16BE(question.QTYPE, this.offset)
    this.offset += 2

    this.buffer.writeUInt16BE(question.QCLASS, this.offset)
    this.offset += 2
  }

  setResource(resource) {
    const { buffer, length } = writeName(resource.NAME)
    this.buffer.fill(buffer, this.offset, this.offset + length)
    this.offset += length

    this.buffer.writeUInt16BE(resource.TYPE, this.offset)
    this.offset += 2

    this.buffer.writeUInt16BE(resource.CLASS, this.offset)
    this.offset += 2

    this.buffer.writeUInt32BE(resource.TTL, this.offset)
    this.offset += 4

    this.buffer.writeUInt16BE(resource.RDLENGTH, this.offset)
    this.offset += 2

    this.buffer.fill(resource.RDATA, this.offset, this.offset + resource.RDLENGTH)
    this.offset += resource.RDLENGTH
  }
}
