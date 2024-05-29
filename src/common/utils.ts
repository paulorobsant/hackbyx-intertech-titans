import { v4 as uuidv4 } from 'uuid';
import base64url from 'base64-url';

export const generateShortUrl = (baseUrl: string): { shortPath: string, shortUrl: string } => {
    const uuid = uuidv4();
    const shortPath = base64url.encode(uuid);
    const shortUrl = `${baseUrl}${shortPath}`;
    return { shortUrl, shortPath };
};