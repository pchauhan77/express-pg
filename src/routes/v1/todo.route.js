const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const todoValidation = require('../../validations/todo.validation');
const userController = require('../../controllers/todo.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(todoValidation.createTodo), userController.createTodo)
  .get(auth('getUsers'), validate(todoValidation.getTodos), userController.getTodos);

router
  .route('/:todoId')
  .get(auth('getTodos'), validate(todoValidation.getTodo), userController.getTodo)
  .patch(auth('updateTodo'), validate(todoValidation.updateTodo), userController.updateTodo)
  .delete(auth('deleteTodo'), validate(todoValidation.deleteTodo), userController.deleteTodo);

module.exports = router;