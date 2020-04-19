import jsonwebtoken from 'jsonwebtoken';
import HttpError from '../models/http-error';

export default (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token: any = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed 1');
    }
    const decodedToken: any = jsonwebtoken.verify(token, process.env.JWL_KEY as string);
    req.userData = { userId: decodedToken.user };
    next();
  } catch(err) {
    const error = new HttpError('Authentication failed 2', 401);
    return next(error);
  }
}