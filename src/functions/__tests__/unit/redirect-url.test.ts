import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../../../common/db';
import { handler } from '../../redirect-url';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
    GetCommand: jest.fn(),
}));

jest.mock('../../../common/db', () => ({
    send: jest.fn(),
}));

describe('handler', () => {
    it('deve retornar 400 se o ID não for fornecido na rota', async () => {
        const event = {
            pathParameters: {},
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: 'ID não fornecido na rota' });
    });

    it('deve retornar 404 se a URL não for encontrada para o ID fornecido', async () => {
        (docClient.send as jest.Mock).mockResolvedValue({});

        const event = {
            pathParameters: { id: '123' },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ message: 'URL não encontrada para o ID fornecido' });
    });

    it('deve retornar 302 se a URL for encontrada', async () => {
        (docClient.send as jest.Mock).mockResolvedValue({
            Item: { original_url: 'https://example.com' },
        });

        const event = {
            pathParameters: { id: '123' },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(302);
        expect(result.headers?.Location).toBe('https://example.com');
        expect(result.body).toBe('');
    });

    it('deve retornar 500 se ocorrer um erro interno do servidor', async () => {
        (docClient.send as jest.Mock).mockRejectedValue(new Error('Erro interno'));

        const event = {
            pathParameters: { id: '123' },
        } as unknown as APIGatewayProxyEvent;

        const result = await handler(event);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toEqual({ message: 'Erro interno do servidor' });
    });
});
