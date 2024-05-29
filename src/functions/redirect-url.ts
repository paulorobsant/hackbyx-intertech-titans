import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import docClient from '../common/db';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;

        console.log('id:', id);

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'ID não fornecido na rota' }),
            };
        }

        const params = {
            TableName: 'urls',
            Key: {
                pk: id,
                sk: id,
            },
        };

        const { Item } = await docClient.send(new GetCommand(params));

        if (!Item || !Item.original_url) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'URL não encontrada para o ID fornecido' }),
            };
        }

        return {
            statusCode: 302,
            headers: {
                Location: Item.original_url,
            },
            body: '',
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor' }),
        };
    }
};
