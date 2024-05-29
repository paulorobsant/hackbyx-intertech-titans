import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const ddbClient = new DynamoDBClient({
    region: 'sa-east-1',
    apiVersion: '2012-08-10',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_KEY as string,
    },
});

const docClient = DynamoDBDocumentClient.from(ddbClient, {});

export default docClient;
