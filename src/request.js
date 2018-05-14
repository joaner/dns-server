module.exports = class Request {
  /**
   * @param {Buffer} buffer - message
   */
  constructor(buffer) {
    this.buffer = buffer
  }

  /**
   * read header section
   * @return {Object}
   */
  getHeader() {
    const section = this.buffer.slice(0, 12)

    const header = {
      ID: section.readUInt16BE(0),
      INFO: section.readUInt16BE(2),
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
    const section = this.buffer.slice(12);

    const domain = [];

    let start = 0
    let length
    while (length = section.readUInt8(start)) {
      const end = start + 1 + length
      const part = section.slice(start + 1, end)
      domain.push(part.toString('utf8'))

      start = end
    }

    return domain.join('.')
  }
}
