const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
// const Token = require('../models/token.model');
const client = require('../db');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const {ref} = require("joi");

const isPasswordMatch = (password, user) => {
  return bcrypt.compare(password, user.password);
}

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await isPasswordMatch(password, user))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const removeTokenDoc = async (token) => {
   return await client.query(`DELETE FROM token WHERE token='${token}'`)
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const query =
    `SELECT * FROM token WHERE token='${refreshToken}' AND type='${tokenTypes.REFRESH}' AND blacklisted='false'`
  const refreshTokenDoc = await client.query(query);
  console.log('REFRESH TOKEN', refreshTokenDoc);

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await removeTokenDoc(refreshToken);
  client.end;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    console.log('refreshTokenDoc', refreshTokenDoc);
    const user = await userService.getUserById(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await removeTokenDoc(refreshToken);
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });

    const query = `DELETE FROM token WHERE user_id='${user.id}' AND type='${tokenTypes.RESET_PASSWORD}'`
    await client.query(query);
    client.end;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }

    const query = `DELETE FROM token WHERE user_id='${user.id}' AND type='${tokenTypes.VERIFY_EMAIL}'`
    await client.query(query);
    await client.query(`UPDATE users set is_email_verified='true' WHERE id='${user.id}'`);
    client.end;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
