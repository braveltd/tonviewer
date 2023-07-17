import BN from 'bn.js';

// look up tables
const toHexArray = [];
const toByteMap = {};
for (let ord = 0; ord <= 0xff; ord++) {
  let s = ord.toString(16);
  if (s.length < 2) {
    s = '0' + s;
  }
  toHexArray.push(s);
  toByteMap[s] = ord;
}

/**
 * converter using lookups
 */
function bytesToHex(buffer: Uint8Array): string {
  const hexArray = [];
  // (new Uint8Array(buffer)).forEach((v) => { hexArray.push(toHexArray[v]) });
  for (let i = 0; i < buffer.byteLength; i++) {
    hexArray.push(toHexArray[buffer[i]]);
  }
  return hexArray.join('');
}

/**
 * reverse conversion using lookups
 */
function hexToBytes(s: string): Uint8Array {
  s = s.toLowerCase();
  const length2 = s.length;
  if (length2 % 2 !== 0) {
    throw new Error('hex string must have length a multiple of 2');
  }
  const length = length2 / 2;
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const i2 = i * 2;
    const b = s.substring(i2, i2 + 2);
    // eslint-disable-next-line no-prototype-builtins
    if (!toByteMap.hasOwnProperty(b)) {
      throw new Error('invalid hex character ' + b);
    }
    result[i] = toByteMap[b];
  }
  return result;
}

function stringToBytes(str: string, size = 1): Uint8Array {
  let buf;
  let bufView;
  if (size === 1) {
    buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
  }
  if (size === 2) {
    buf = new ArrayBuffer(str.length * 2);
    bufView = new Uint16Array(buf);
  }
  if (size === 4) {
    buf = new ArrayBuffer(str.length * 4);
    bufView = new Uint32Array(buf);
  }
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return new Uint8Array(bufView.buffer);
}

function crc16(data: ArrayLike<number>): Uint8Array {
  const poly = 0x1021;
  let reg = 0;
  const message = new Uint8Array(data.length + 2);
  message.set(data);
  for (const byte of message) {
    let mask = 0x80;
    while (mask > 0) {
      reg <<= 1;
      if (byte & mask) {
        reg += 1;
      }
      mask >>= 1;
      if (reg > 0xffff) {
        reg &= 0xffff;
        reg ^= poly;
      }
    }
  }
  return new Uint8Array([Math.floor(reg / 256), reg % 256]);
}

/**
 * TODO: base64 decoding process could ignore one extra character at the end of string and the byte-length
 * check below won't be able to catch it.
 */
function base64toString(base64) {
  if (typeof self === 'undefined') {
    // TODO: (tolya-yanot) Buffer silently ignore incorrect base64 symbols, we need to throw error
    return Buffer.from(base64, 'base64').toString('binary');
  } else {
    return atob(base64);
  }
}

function stringToBase64(s) {
  if (typeof self === 'undefined') {
    // TODO: (tolya-yanot) Buffer silently ignore incorrect base64 symbols, we need to throw error
    return Buffer.from(s, 'binary').toString('base64');
  } else {
    return btoa(s);
  }
}

export { BN, bytesToHex, hexToBytes, stringToBytes, crc16, base64toString, stringToBase64 };
