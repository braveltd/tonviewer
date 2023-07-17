import isUndefined from 'lodash/isUndefined';
import BN from 'bn.js';
import ethunit from 'ethjs-unit';
import { Address } from './address';

/**
 * from nanocoins to coins
 * @param amount  {BN | string}
 * @return {string}
 */
export function fromNano(amount) {
  if (!BN.isBN(amount) && !(typeof amount === 'string')) {
    throw new Error('Please pass numbers as strings or BN objects to avoid precision errors.');
  }

  return ethunit.fromWei(amount, 'gwei');
}

export const convertNanoton = (value, round = true) => {
  return parseFloat(fromNano(value?.toString()));
};

export const formatAddress = (base64Address = '', length = 10) => {
  try {
    const address = new Address(base64Address);

    const formattedAddress = address.toString(
      address.isUserFriendly,
      address.isUrlSafe,
      address.isBounceable,
      Boolean(process.env.isTestOnly)
    );

    if (formattedAddress.length / 2 <= length) return formattedAddress;

    const first = formattedAddress.slice(0, length);
    const second = formattedAddress.substring(formattedAddress.length - length);

    return `${first}…${second}`;
  } catch {
    if (base64Address.length / 2 <= length) return base64Address;

    const first = base64Address.slice(0, length);
    const second = base64Address.substring(base64Address.length - length);

    return `${first}…${second}`;
  }
};

export const isValidAddress = (addr = '') => {
  return Address.isValid(addr);
};

export const addressToBase64 = (addr = '') => {
  if (!addr || typeof addr === 'object') return '';
  const address = new Address(addr);
  return address.toString(true, true, true, Boolean(process.env.isTestOnly));
};

export const base64ToAddress = (addr = '') => {
  if (!addr || typeof addr === 'object') return '';
  const address = new Address(addr);
  return address.toString(false, false, false, Boolean(process.env.isTestOnly));
};

export const serializeNestedObject = <T>(object: T): T => {
  function replaceUndefinedByNull(obj) {
    if (typeof obj === 'object') {
      // iterating over the object using for..in
      for (const keys in obj) {
        // checking if the current value is an object itself
        if (typeof obj[keys] === 'object') {
          // if so then again calling the same function
          replaceUndefinedByNull(obj[keys]);
        } else {
          obj[keys] = isUndefined(obj[keys]) ? null : obj[keys];
        }
      }
    }
    return obj;
  }
  return replaceUndefinedByNull(object);
};

export const sliceString = (str: string, length = 8) => {
  if (str.length / 2 < length) {
    return str;
  }

  const first = str.slice(0, length);
  const second = str.substring(str.length - length);

  return `${first}…${second}`;
};
