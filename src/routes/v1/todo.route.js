const express = require('express');
const validate = require('../../middlewares/validate');
const todoValidation = require('../../validations/todo.validation');
const userController = require('../../controllers/todo.controller');

const router = express.Router();

router.post('/createTodo', validate(todoValidation.createTodo), userController.createTodo)
router.get('/getTodos', validate(todoValidation.getTodos), userController.getTodos);

router.get('/getTodo/:todoId', validate(todoValidation.getTodo), userController.getTodo)
router.patch('/updateTodo/:todoId', validate(todoValidation.updateTodo), userController.updateTodo)
router.delete('/deleteTodo/:todoId', validate(todoValidation.deleteTodo), userController.deleteTodo);

module.exports = router;