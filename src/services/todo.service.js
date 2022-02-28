const httpStatus = require('http-status');
const client = require('../db');
const ApiError = require('../utils/ApiError');

/**
 * Create a todo
 * @returns {Promise<Todo>}
 * @param userBody
 */
const createTodo = async (userBody) => {
  const { description } = userBody;
  if (description.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Description should not be empty');
  }

  const insertQuery = `insert into todo(description) values('${description}') RETURNING *`
  const result = await client.query(insertQuery)
  client.end;
  return result.rows
};

const getTodos = async () => {
  const result = await client.query(`Select todo_id, description from todo`);
  client.end;
  return result.rows;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getTodoById = async (id) => {
  const result = await client.query(`Select todo_id, description from todo where todo_id=${id}`);
  client.end;
  return result.rows;
};

/**
 * Update user by id
 * @param todoId
 * @param {Object} updateBody
 * @returns {Promise<{message: string}>}
 */
const updateTodoById = async (todoId, updateBody) => {
  const { description } = updateBody;
  if (description.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Description should not be empty');
  }
  let updateQuery = `update todo set description = '${description}' where todo_id = ${todoId}`

  const result = await client.query(updateQuery)
  client.end;
  return { message: 'Update was successful' };
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<{message: string}>}
 */
const deleteTodoById = async (todoId) => {
  let insertQuery = `delete from todo where todo_id=${todoId}`
  const result = await client.query(insertQuery)
  client.end;
  return { message: 'Deletion was successful' }
};

module.exports = {
  createTodo,
  getTodoById,
  getTodos,
  updateTodoById,
  deleteTodoById,
};
