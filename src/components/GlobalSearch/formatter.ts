import TonWeb from 'tonweb';
import { isValidAddress, addressToBase64, base64ToAddress } from '../../helpers';

const hashReg = /0:[A-Za-z0-9]+/i;
const base64Reg = /^[A-Za-z0-9+/]*[=]{0,2}$/;
const base64UrlSafeReg = /^[A-Za-z0-9_-]*[.=]{0,2}$/;
// eslint-disable-next-line max-len
const urlReg = /([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i;
const hexReg = /[A-Za-z0-9]+/i;

const isHash = (str) => hashReg.test(str);
const isBase64 = (str) => base64Reg.test(str);
const isUrlSafeBase64 = (str) => base64UrlSafeReg.test(str);
const isUrl = (str) => urlReg.test(str);
const isHex = (str) => hexReg.test(str);

function base64UrlToBase64(base64Url: string) {
  // Replace characters specific to Base64 URL encoding
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if necessary
  const padding = base64.length % 4;
  if (padding === 2) {
    base64 += '==';
  } else if (padding === 3) {
    base64 += '=';
  }

  return base64;
}

export function replaceString(str): { type: 'address' | 'transaction'; value: string } {
  if (isUrl(str)) {
    return {
      type: 'address',
      value: str
    };
  }
  if (str.length > 2 && str.length < 32) {
    return {
      type: 'address',
      value: str
    };
  }
  if (isValidAddress(str)) {
    const base64Addr = base64ToAddress(str);
    return {
      type: 'address',
      value: addressToBase64(base64Addr)
    };
  }
  if (isHash(str)) {
    return {
      type: 'address',
      value: addressToBase64(str)
    };
  }
  if (isHex(str)) {
    try {
      const hexToBytes = TonWeb.utils.hexToBytes(str);
      if (hexToBytes && hexToBytes.byteLength === 32) {
        return {
          type: 'transaction',
          value: str
        };
      }
    } catch (e) {
      //
    }
  }
  if (isUrlSafeBase64(str)) {
    const base64 = base64UrlToBase64(str);
    try {
      const base64ToBytes = TonWeb.utils.base64ToBytes(base64);
      return {
        type: 'transaction',
        value: TonWeb.utils.bytesToHex(base64ToBytes)
      };
    } catch (e) {
      //
    }
  }
  if (isBase64(str)) {
    try {
      const base64ToBytes = TonWeb.utils.base64ToBytes(str);
      return {
        type: 'transaction',
        value: TonWeb.utils.bytesToHex(base64ToBytes)
      };
    } catch (e) {
      //
    }
  }
  return {
    type: 'address',
    value: str
  };
}
