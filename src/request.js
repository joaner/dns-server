const { readName } = require('./utils');

module.exports = class Request {
  /**
   * @param {Buffer} buffer - message
   */
  constructor(buffer) {
    this.buffer = buffer

    this.lengths = {
      header: 12,
      question: null,
    }
  }

  /**
   * read header section
   * @return {Object}
   */
  getHeader() {
    const section = this.buffer.slice(0, this.lengths.header)

    const info = section.readUInt16BE(2)

    const header = {
      _BUFFER: section,
      ID: section.readUInt16BE(0),
      QR: info >>> 31, // 1 bit
      OPCODE: info << 1 >>> 28, // 4 bits
      AA: info << 5 >>> 31, // 1 bit
      TC: info << 6 >>> 31, // 1 bit
      RD: info << 7 >>> 31, // 1 bit
      RA: info << 8 >>> 31, // 1 bit
      Z: info << 9 >>> 29, // 3 bits
      RCODE: info << 12 >>> 28, // 4 bits
      QDCOUNT: section.readUInt16BE(4),
      ANCOUNT: section.readUInt16BE(6),
      NSCOUNT: section.readUInt16BE(8),
      ARCOUNT: section.readUInt16BE(10),
    }

    return header
  }

  /**
   * read question section
   * @return {String}
   */
  getQuestion() {
    const section = this.buffer.slice(this.lengths.header)

    const { length, hostname } = readName(section)
    let offset = length

    const QTYPE = section.readUInt16BE(offset)
    offset += 2

    const QCLASS = section.readUInt16BE(offset)
    this.lengths.question = offset + 2

    return {
      _BUFFER: section.slice(0, this.lengths.question),
      _BUFFER_QNAME: section.slice(0, this.lengths.question - 4),
      QNAME: hostname.join('.'),
      QTYPE,
      QCLASS,
    }
  }
}
