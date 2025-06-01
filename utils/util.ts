import CryptoJS from 'crypto-js';

export const generateHashId = (data: Record<string, any>) => {
  const raw = Object.values(data).join('~');
  return CryptoJS.MD5(raw).toString(); // 或 SHA256
};
