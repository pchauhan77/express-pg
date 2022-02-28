const httpStatus = require('http-status');
const client = require('../db');
const ApiError = require('../utils/ApiError');

/**
 * Create a todo
 * @returns {Promise<Todo>}
 * @param userBody
 */
const createTodo = async (userBody) => {
  const { description, userId } = userBody;
  if (description.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Description should not be empty');
  }

  const insertQuery = `insert into todo(description, user_id) values('${description}', '${userId}')`
  const result = await client.query(insertQuery)
  client.end;
  console.log('Result', result);
  return result.rows
};

const getTodos = async (userId) => {
  const result = await client.query(`Select * from todos where user_id=${userId}`);
  client.end;
  console.log("REsult", result)
  return result.rows;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getTodoById = async (id) => {
  const result = await client.query(`Select * from todo where todo_id=${req.params.id}`);
  client.end;
  console.log("REsult", result)
  return result.rows;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<string>}
 */
const updateTodoById = async (userId, updateBody) => {
  const { description } = updateBody;
  let updateQuery = `update todo set description = '${description}' where todo_id = ${userId}`

  const result = await client.query(updateQuery)
  client.end;
  console.log("REsult", result)
  return 'Update was successful';
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<string>}
 */
const deleteTodoById = async (userId) => {
  let insertQuery = `delete from todo where todo_id=${userId}`
  const result = await client.query(insertQuery)
  console.log("REsult", result)
  client.end;
  return 'Deletion was successful'
};

module.exports = {
  createTodo,
  getTodoById,
  getTodos,
  updateTodoById,
  deleteTodoById,
};
