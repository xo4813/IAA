var express = require("express");
var User = require("../schemas/user");
var Account = require("../schemas/account");
var Posting = require("../schemas/posting");
var router = express.Router();
var { isLoggedIn, isNotLoggedIn } = require('../passportConfig/isitLoggedin');
var passport = require('passport');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// 이미지 준비작업
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 홈
router.post('/fortest', upload.single('documents'),(req, res) => {
  console.log(__dirname)
  console.log(`이거뽑는다${req.file}`)
  console.log(req.file.originalname)
  res.render('fortest',{imye : req.file.filename});
});

// 포스팅생성
router.post("/register_posting", upload.single('documents'), function (req, res, next) {
  console.log('z')
  console.log(`${req.user} 세션`);
  const {
    accountEmail,
    accountName,
    accountGrade,
    profilePicture,
    pastPrice,
    predictPrice,
    buyState,
    sellState,
    middleState,
    standardUnit,

    ChoicePrice,
    subtitle,
    content,
    predictDay,
    warrantLink,
    warrantImage,
    predictCompany
  } = req.body;
  console.log("req.body 가 이상해~!~!");
  console.log(req.body);
  console.log(`documents 받아볼게요${req.file.originalname}`)
  console.log(req.file)
  const posting = new Posting({
    accountEmail: req.user.accountEmail,
    accountName: req.user.accountName,
    accountGrade: req.user.accountGrade,
    profilePicture: req.body.profilePicture,
    pastPrice: req.body.pastPrice,
    subtitle: req.body.subtitle,
    content: req.body.content,
    predictPrice: req.body.predictPrice,
    predictDay: req.body.predictDay,
    predictCompany: req.body.predictCompany,
    buyState: req.body.buyState,
    sellState: req.body.sellState,
    middleState: req.body.middleState,
    standardUnit: req.body.standardUnit,
    warrantLink: req.body.warrantLink,
    warrantImage: req.body.warrantImage,
    
    // accountEmail,
    // accountName,
    // accountGrade,
    // profilePicture,
    // pastPrice,
    // predictPrice,
    // buyState,
    // sellState,
    // middleState,
    // standardUnit,
  });
  posting
    .save()
    .then(result => {
      console.log(result);
      // res.status(201).json(result);
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

// var passport = require('passport'),
//  LocalStrategy = require('passport-local').Strategy;

router.get("/", function (req, res, next) {
  User.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.post("/", function (req, res, next) {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
