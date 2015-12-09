var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
  res.render('supervisor', { title: 'Express' });
});

module.exports = router;
