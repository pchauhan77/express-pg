const httpStatus = require('http-status');
const client = require('../db');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const DEFAULT_ROLE = 'user'

const createNewUser = async (userBody) => {
  const hashPassword = await bcrypt.hash(userBody.password, 8);
  const insertQuery = `insert into users(name, email, password, user_role, is_email_verified) 
                       values('${userBody.name}',
                        '${userBody.email}',
                        '${hashPassword}',
                         '${userBody.role || DEFAULT_ROLE}',
                          false
                       ) RETURNING *;`

  return await client.query(insertQuery)
}

const checkForEmail = (email) => client.query(`Select * from users where email = '${email}'`);

const prepareFields = (updateBody) => {
 let query = 'set';
 if(updateBody && Object.keys(updateBody).length){
   for(let key of Object.keys(updateBody)){
     if(key === 'email'){
       continue;
     }
     query = `${query} ${key}='${updateBody[key]}',`
   }
 }
 return query
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<{message: string}>}
 */
const createUser = async (userBody) => {
  // Check email id already exist or not
  let result = { rows: [{}]}
  const user = await checkForEmail(userBody.email);
  if(!user.rows.length){
      result = await createNewUser(userBody);
  }else{
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  client.end;
  return result.rows[0];
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  let query = `SELECT * FROM users`

  // Include options
  if(options && Object.keys(options).length){
    if(options.hasOwnProperty('sortBy')){
      query = `${query} ORDER BY name ${options.sortBy}`
    }if(options.hasOwnProperty('limit')){
      const page = options.page || 1;
      const offset = (page - 1) * Number(options.limit);
      query = `${query} LIMIT ${options.limit} OFFSET ${offset}`
    }
  }

  // Include filter
  if(filter && Object.keys(filter).length){
    if(filter.hasOwnProperty('name') && filter.hasOwnProperty('role')){
      query = `${query} WHERE name='${filter.name}' AND user_role='${filter.role}'`
    }else if(filter.hasOwnProperty('name')){
      query = `${query} WHERE name='${filter.name}'`
    }else {
      query = `${query} WHERE user_role='${filter.role}'`
    }
  }

  console.log("QUERY", query);
  const result = await client.query(query);
  return result.rows;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const result = await client.query(`SELECT * FROM users WHERE id='${id}'`);
  return result.rows
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const result = await client.query(`SELECT * FROM users WHERE email='${email}'`);
  return result.rows[0];
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await client.query(`Select * from users where id='${userId}'`);
  if (!user.rows.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  let updateField = prepareFields(updateBody);
  if (updateBody.email) {
    const emailAlreadyExist = await checkForEmail(updateBody.email);
    if(!emailAlreadyExist.rows.length){
        updateField = `${updateField} email='${updateBody.email}'`
    }else{
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }

  console.log("QUERY", updateField);

  const result = await client.query(`UPDATE users ${updateField} where id='${userId}'`);
  return result.rows;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<{message: string}>}
 */
const deleteUserById = async (userId) => {
  const user = await client.query(`Select * from users where id='${userId}'`);
  if (!user.rows.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await  client.query(`delete from users where id=${userId}`);
  return { message: "User Deleted" }
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
