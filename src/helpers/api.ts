import { Configuration } from 'tonapi-sdk-js';

export const apiConfigV2 = (isClient = false): Configuration => {
  const token = isClient ? process.env.authClientToken : process.env.authServerToken;
  const host = process.env.host || 'https://tonapi.io';

  return new Configuration({
    basePath: host,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
