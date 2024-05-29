import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import docClient from '../common/db';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { generateShortUrl } from '../common/utils';
import dotenv from 'dotenv';

dotenv.config();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { url }: any = JSON.parse(event.body as any);
        const { shortUrl, shortPath } = generateShortUrl(process.env.BASE_URL as string);
        const params = {
            TableName: 'urls',
            Item: {
                pk: shortPath,
                sk: shortPath,
                original_url: url,
                created_at: new Date().toISOString(),
            },
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({
                shortUrl,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
