var express = require('express');
var User = require('../schemas/user');
var Account = require('../schemas/account');
var Posting = require('../schemas/posting');
var passport = require('passport');
var { isLoggedIn, isNotLoggedIn } = require('../passportConfig/isitLoggedin');


var router = express.Router();

// 하나조회
router.get("/:predictCompany", function (req, res) {
  // console.log(`이거는 파람스${res.params}`)
  // console.log(`이거는 바디${res.body}`)
  Posting.find({ predictCompany: req.params.predictCompany }, function (err, company) {
    if (err) return res.status(500).json({ error: err });
    if (!company) return res.status(404).json({ error: 'company 없다.' })
    res.send(company);
  })
});


router.get('/', function (req, res, next) {
  Posting.find({})
    .then((users) => {
      // res.json(users);
      res.send(users);
      // res.sendFile(path.join(__dirname, '../public/search.html'), { title: '홈페이지' });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.post('/', function (req, res, next) {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  });
  user.save()
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
