import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as usersService from '../users/users.service.js';
import config from '../../config/index.js';

export async function isUserPasswordValid({ user, password }) {

  if (!user) {
    throw new Error('Cannot find user with this email!');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Cannot find user with this email!');
  }

  return user;
}

export function getAccessToken({ user }) {
  return jwt.sign({ userId: user._id }, config.secret, { expiresIn: '30 days' });
}

export async function createUserAndGetAccessToken({
  email,
  password,
  firstName,
  lastName,
}) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await usersService.createOneUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return getAccessToken({ user });
}

export async function authenticateUserFromToken({ token }) {
  const { userId } = jwt.verify(token, config.secret);

  return usersService.findOneById({ userId });
}