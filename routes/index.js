// 각 페이지별 첫화면.
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const User = require('../schemas/user');
const Posting = require('../schemas/posting');

var passport = require('passport');
var { isLoggedIn, isNotLoggedIn } = require('../passportConfig/isitLoggedin');
var Account = require('../schemas/account');

const router = express.Router();

////
// router.get('/', async (req, res, next) => {
//   try {
//     const users = await User.find()
//     res.render('mongoose', { users });
//   } catch (error) {
//     console.error(err);
//     next(err);
//   }
// });

// 홈
router.get('/home', (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/statChart.html'), { title: '홈페이지' });
});

router.get('/home1', (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/home.html'), { title: '홈페이지' });
});


// 로그인
router.get('/login', (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/login.html'), { title: '로그인' })
})

// local passport로그인
router.get('/loginLocalPassport', isNotLoggedIn, (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/loginLocalPassport.html'), { title: '로그인pasport' })
})

// consent screen에서 승인
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect('/');
  });

  router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
  }));
  

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
}
)

// 회원가입
router.get('/register', isNotLoggedIn, (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/register.html'), { title: '회원가입 페이지' });
});

// 포스팅
router.get('/posting', isLoggedIn, (req, res) => {
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '../public/posting.html'), { title: '포스팅 페이지' });
});

// 검색
router.get('/search', (req, res) => {
  Posting.find({})
    .then((users) => {
      // res.json(users);
      console.log(`search에서 포스팅 목록 뽑아오기 ${users}`)
      res.sendFile(path.join(__dirname, '../public/search.html'), { title: '검색 페이지' });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// 스탯차트
router.get('/statChart', (req, res) => {
  console.log('왜안찍혀')
  Posting.find({ accountEmail: "req.user.accountEmail" })
    .then(users => {
      console.log('문제있니?')
      console.log(users)
      // res.json(users);
      // res.sendFile(path.join(__dirname, '../public/statChart.html'), { title: '검색 페이지' });
      res.send(users);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
  console.log(__dirname)
  // res.sendFile(path.join(__dirname, '../public/statChart.html'), { title: '스탯확인 페이지' });
});

// 방만들기
router.get('/roomcreate', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 방보기
router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

// 방생성
router.post('/room', async (req, res, next) => {
  try {
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const newRoom = await room.save();
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 방입장
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/');
    }
    if (room.password && room.password !== req.query.password) {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }
    const { rooms } = io.of('/chat').adapter;
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 방삭제
router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 방채팅
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GIF업로드준비
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

// GIF업로드
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
