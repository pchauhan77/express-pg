const express = require('express');
const validate = require('../../middlewares/validate');
const todoValidation = require('../../validations/todo.validation');
const userController = require('../../controllers/todo.controller');
const { bruteforce } = require('../../middlewares/api-failed-bouncer');

const router = express.Router();

router.post('/createTodo', bruteforce.prevent, validate(todoValidation.createTodo), userController.createTodo);
router.get('/getTodos', bruteforce.prevent, validate(todoValidation.getTodos), userController.getTodos);

router.get('/getTodo/:todoId', bruteforce.prevent, validate(todoValidation.getTodo), userController.getTodo);
router.patch('/updateTodo/:todoId', bruteforce.prevent, validate(todoValidation.updateTodo), userController.updateTodo);
router.delete('/deleteTodo/:todoId', bruteforce.prevent, validate(todoValidation.deleteTodo), userController.deleteTodo);

module.exports = router;
