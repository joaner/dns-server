/**
 * read name buffer
 * @param {Buffer} buffer
 */
module.exports.readName = function(buffer) {
  const hostname = [];

  let offset = 0
  let length
  while (length = buffer.readUInt8(offset)) {
    const end = offset + 1 + length
    const part = buffer.slice(offset + 1, end)
    hostname.push(part.toString('utf8'))

    offset = end
  }

  return {
    length: offset + 1,
    hostname: hostname.join('.'),
  }
}

/**
 * write name buffer
 * @param {Buffer} buffer
 */
module.exports.writeName = function(hostname) {
  const length = Buffer.byteLength(hostname) + 2
  const buffer = Buffer.alloc(length)

  let offset = 0
  for (const part of hostname.split('.')) {
    const length = Buffer.byteLength(part)

    buffer.writeUInt8(length, offset++)
    buffer.write(part, offset, offset + length)

    offset += length
  }
  buffer.writeUInt8(0, offset)

  return {
    length,
    buffer,
  }
}
