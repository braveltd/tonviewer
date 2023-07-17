import camelCase from 'lodash/camelCase';
import isNil from 'lodash/isNil';

export const camelCaseObject = (obj: object) => {
  const reducer = (acc, [key, value]) => {
    const camelCasedKey = camelCase(key);

    if (Array.isArray(value)) {
      acc[camelCasedKey] = value.map((item) =>
        typeof item === 'string'
          ? item
          : Object.entries(item).reduce(reducer, {} as Record<string, unknown>)
      );
    } else if (isNil(value)) {
      acc[camelCasedKey] = value;
    } else if (typeof value === 'object') {
      acc[camelCasedKey] = camelCaseObject(value);
    } else {
      acc[camelCasedKey] = value;
    }

    return acc;
  };

  return Object.entries(obj).reduce(reducer, {} as Record<string, unknown>);
};
