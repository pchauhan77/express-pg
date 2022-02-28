const moment = require('moment');
const ExpressBrute = require('express-brute');

const failCallback = function (req, res, next, nextValidRequestDate) {
  res.send({
    message: `You've made too many failed attempts in a short period of time, please try again ${moment(
      nextValidRequestDate
    ).fromNow()}`,
  });
};

const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
  freeRetries: 0,
  failCallback,
});

const bruteByEmail = () => {
  return bruteforce.getMiddleware({
    key: function(req, res, next) {
      next(req.body.email);
    },
  });
};

module.exports = {
  bruteforce,
  bruteByEmail
};
