const Joi = require('joi');

const createTodo = {
  body: Joi.object().keys({
    description: Joi.string().required(),
  }),
};

const getTodos = {
  query: Joi.object().keys({
    description: Joi.string(),
  }),
};

const getTodo = {
  params: Joi.object().keys({
    todoId: Joi.string().required(),
  }),
};

const updateTodo = {
  params: Joi.object().keys({
    todoId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string().required(),
    })
    .min(1),
};

const deleteTodo = {
  params: Joi.object().keys({
    todoId: Joi.string().required(),
  }),
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
};
