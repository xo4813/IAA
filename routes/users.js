var express = require("express");
var User = require("../schemas/user");
var Account = require("../schemas/account");
var Posting = require("../schemas/posting");
var router = express.Router();
var { isLoggedIn, isNotLoggedIn } = require('../passportConfig/isitLoggedin');
var passport = require('passport');
var multer = require('multer')
var path = require('path')
var fs = require('fs')

// 이미지를 위함
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

// 회원가입
router.post("/register_user", upload.single('document'), (req, res,next) => {
  const {
    register_email,
    register_name,
    register_password,
    register_address,
  } = req.body;
  
  console.log(req.body);
  // console.log(req.file.filename);
  console.log(`여기는 프로필사진출력 - ${req.file}`)
  console.log(`여기는 프로필사진출력 - ${req.file.originalname}`)
  const account = new Account({
    accountEmail: req.body.register_email,
    accountName: req.body.register_name,
    accountPwd: req.body.register_password,
    accountGrade: req.body.register_address,
    profilePicture : req.file.filename
  });
  account
    .save()
    .then(result => {
      console.log(result);
      // res.status(201).json(result);
      res.status(201).redirect("/");
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

// var passport = require('passport'),
//  LocalStrategy = require('passport-local').Strategy;

// 세션로그인
router.post('/loginLocalPassport', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/register');
    });
  })(req, res, next)
})

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.sessiong.destroy();
  res.redirect('/');
}
)


// 로그인테스트중
router.post("/login", function (req, res, next) {
  const { loginId, loginPwd } = req.body;
  Account.findOne({ accountEmail: loginId }, function (err, user) {
    console.log(`로그인해서 잡은거${user}`)
    console.log(`로그인해서 잡은거${user.accountPwd}`)
    console.log(`로그인시도한 비번${loginPwd}`)
    if (user.accountPwd === loginPwd) {
      console.log('로그인성공')
    } else {
      console.log('로그인실패')
    }
  })
  res.redirect('/');
});



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
