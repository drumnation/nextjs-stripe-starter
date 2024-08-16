import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type UserHasuraClaims = {
  'x-hasura-allowed-roles': string[];
  'x-hasura-default-role': string;
  'x-hasura-user-id': string;
};

export type User = {
  allowedRoles: string[];
  defaultRole: string;
  id: string;
};

export const getUser = (req: Request): User | null => {
  const authorizationHeader = req.headers['authorization'];
  const accessToken = authorizationHeader?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const jwtSecret = JSON.parse(process.env.NHOST_JWT_SECRET as string);
  const decodedToken = jwt.verify(accessToken, jwtSecret.key) as any;

  const hasuraClaims = decodedToken[
    'https://hasura.io/jwt/claims'
  ] as UserHasuraClaims;

  const user = {
    allowedRoles: hasuraClaims['x-hasura-allowed-roles'],
    defaultRole: hasuraClaims['x-hasura-default-role'],
    id: hasuraClaims['x-hasura-user-id']
  };

  return user;
};

export const allowCors = (fn: any) => async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return await fn(req, res);
};
