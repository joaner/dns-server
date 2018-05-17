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
    hostname,
  }
}
