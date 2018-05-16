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
    const section = this.buffer.slice(this.lengths.header);

    const domain = [];

    let offset = 0
    let length
    while (length = section.readUInt8(offset)) {
      const end = offset + 1 + length
      const part = section.slice(offset + 1, end)
      domain.push(part.toString('utf8'))

      offset = end
    }

    offset += 1
    const QTYPE = section.readUInt16BE(offset)

    offset += 2
    const QCLASS = section.readUInt16BE(offset)

    this.lengths.question = offset + 2

    return {
      QNAME: domain.join('.'),
      QTYPE,
      QCLASS,
    }
  }
}
