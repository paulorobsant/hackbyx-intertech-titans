import { generateShortUrl } from '../../utils';
import * as uuid from 'uuid';
import base64url from 'base64-url';

jest.mock('uuid', () => ({
    v4: jest.fn()
}));

jest.mock('base64-url', () => ({
    encode: jest.fn()
}));

describe('generateShortUrl', () => {
    const mockBaseUrl = 'https://short.url/';

    beforeEach(() => {
        (uuid.v4 as jest.Mock).mockReset();
        (base64url.encode as jest.Mock).mockReset();
    });

    it('should generate a short URL with the provided base URL', () => {
        const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
        const mockShortCode = 'MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAw';
        (uuid.v4 as jest.Mock).mockReturnValue(mockUuid);
        (base64url.encode as jest.Mock).mockReturnValue(mockShortCode);

        const shortUrl = generateShortUrl(mockBaseUrl);
        
        expect(shortUrl.shortUrl).toBe(`${mockBaseUrl}${mockShortCode}`);
        expect(uuid.v4).toHaveBeenCalledTimes(1);
        expect(base64url.encode).toHaveBeenCalledWith(mockUuid);
    });

    it('should generate a different short URL on each call', () => {
        const mockUuid1 = '123e4567-e89b-12d3-a456-426614174000';
        const mockUuid2 = '223e4567-e89b-12d3-a456-426614174001';
        const mockShortCode1 = 'MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAw';
        const mockShortCode2 = 'MjIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAx';

        (uuid.v4 as jest.Mock)
            .mockReturnValueOnce(mockUuid1)
            .mockReturnValueOnce(mockUuid2);
        (base64url.encode as jest.Mock)
            .mockReturnValueOnce(mockShortCode1)
            .mockReturnValueOnce(mockShortCode2);

        const shortUrl1 = generateShortUrl(mockBaseUrl);
        const shortUrl2 = generateShortUrl(mockBaseUrl);

        expect(shortUrl1.shortUrl).toBe(`${mockBaseUrl}${mockShortCode1}`);
        expect(shortUrl2.shortUrl).toBe(`${mockBaseUrl}${mockShortCode2}`);
        expect(shortUrl1.shortUrl).not.toBe(shortUrl2.shortUrl);
        expect(uuid.v4).toHaveBeenCalledTimes(2);
        expect(base64url.encode).toHaveBeenCalledWith(mockUuid1);
        expect(base64url.encode).toHaveBeenCalledWith(mockUuid2);
    });
});
