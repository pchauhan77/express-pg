const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { todoService } = require('../services');

const createTodo = catchAsync(async (req, res) => {
  const user = await todoService.createTodo(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getTodos = catchAsync(async (req, res) => {
  const result = await todoService.getTodos();
  res.send(result);
});

const getTodo = catchAsync(async (req, res) => {
  const user = await todoService.getTodoById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
  }
  res.send(user);
});

const updateTodo = catchAsync(async (req, res) => {
  const user = await todoService.updateTodoById(req.params.userId, req.body);
  res.send(user);
});

const deleteTodo = catchAsync(async (req, res) => {
  await todoService.deleteTodoById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
};
