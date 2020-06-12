import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { promisify } from 'util';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.json({ error: 'Token not provided.' })

  const [, token] = authHeader.split(' ');

  try {

    const decoed = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoed.id;
    return next();

  } catch (error) {
    return res.json({ error: 'Token invalid.' })
  }
}