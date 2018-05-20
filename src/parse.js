const { readName } = require('./utils');

module.exports = class Request {
  /**
   * @param {Buffer} buffer - message
   */
  constructor(buffer) {
    this.buffer = buffer
    this.offset = 0
  }

  /**
   * execute parse sections
   * @return {Object} sections
   */
  execute() {
    const header = this.getHeader()
    const questions = this.parseSections(header.QDCOUNT, this.getQuestion)
    const answers = this.parseSections(header.ANCOUNT, this.getResource)
    const authoritys = this.parseSections(header.NSCOUNT, this.getResource)
    const additionals = this.parseSections(header.ARCOUNT, this.getResource)

    return {
      header,
      questions,
      answers,
      authoritys,
      additionals,
    }
  }

  /**
   * read header section
   * @return {Object}
   */
  getHeader() {
    const info = this.buffer.readUInt16BE(2)

    const header = {
      ID: this.buffer.readUInt16BE(0),
      QR: info >>> 31, // 1 bit
      OPCODE: info << 1 >>> 28, // 4 bits
      AA: info << 5 >>> 31, // 1 bit
      TC: info << 6 >>> 31, // 1 bit
      RD: info << 7 >>> 31, // 1 bit
      RA: info << 8 >>> 31, // 1 bit
      Z: info << 9 >>> 29, // 3 bits
      RCODE: info << 12 >>> 28, // 4 bits
      QDCOUNT: this.buffer.readUInt16BE(4),
      ANCOUNT: this.buffer.readUInt16BE(6),
      NSCOUNT: this.buffer.readUInt16BE(8),
      ARCOUNT: this.buffer.readUInt16BE(10),
    }

    this.offset = 12
    return header
  }

  /**
   * read question section
   * @return {String}
   */
  getQuestion() {
    const { length, hostname } = readName(this.buffer.slice(this.offset))
    this.offset += length

    const QTYPE = this.buffer.readUInt16BE(this.offset)
    this.offset += 2

    const QCLASS = this.buffer.readUInt16BE(this.offset)
    this.offset += 2

    return {
      QNAME: hostname,
      QTYPE,
      QCLASS,
    }
  }

  /**
   * parse multi section
   * @param {Number} count
   * @param {fn}
   */
  parseSections(count, fn) {
    return Array.from({ length: count }).map(() => {
      return fn.call(this)
    })
  }

  /**
   * read answer section
   */
  getResource() {
    const { length, hostname } = readName(this.buffer.slice(this.offset))
    this.offset += length

    const TYPE = section.readUInt16BE(this.offset)
    this.offset += 2

    const CLASS = section.readUInt16BE(this.offset)
    this.offset += 2

    const TTL = section.readUInt32BE(this.offset)
    this.offset += 4

    const RDLENGTH = section.readUInt16BE(this.offset)
    this.offset += 2

    const RDATA = section.slice(this.offset, this.offset + RDLENGTH)
    this.offset += RDLENGTH

    return {
      NAME: hostname,
      TYPE,
      CLASS,
      TTL,
      RDLENGTH,
      RDATA,
    }
  }
}
