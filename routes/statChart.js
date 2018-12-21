var express = require("express");
var User = require("../schemas/user");
var Account = require("../schemas/account");
var Posting = require("../schemas/posting");
var router = express.Router();
var {isLoggedIn, isNotLoggedIn} = require('../passportConfig/isitLoggedin');
var passport = require('passport');

router.post('/loginLocalPassport', passport.authenticate('local', {failureRedirect: '/loginLocalPassport', failureFlash: true}),
  function(req, res){
    res.redirect('/');
  }
)

// 하나조회
router.get("/:accountEmail", function (req, res, next) {
  // console.log(`이거는 파람스${res.params}`)
  // console.log(`이거는 바디${res.body}`)
  console.log(`이거는 바디${req.params.accountEmail}`)
  Posting.find({accountEmail: req.params.accountEmail }).then ((onePosting) => {
    console.log(onePosting)
    console.log('요오오오오기')
    console.log(onePosting[0])
    console.log(onePosting[0].accountEmail)
    let pastPrice = 0;

    
    onePosting.forEach(function(onePosting){
      console.log(`pastPrice${onePosting.pastPrice}`)
      pastPrice += onePosting.pastPrice;
    })

    var predictPrice = 0;
    onePosting.forEach(function(onePosting){
      console.log(`predictPrice${onePosting.predictPrice}`)
      predictPrice += onePosting.predictPrice;
    })

    let buyState =0;
    onePosting.forEach(function(onePosting){
      console.log(`buyState${onePosting.buyState}`)
      buyState += onePosting.buyState;
    })

    let sellState =0;
    onePosting.forEach(function(onePosting){
      console.log(`sellState${onePosting.sellState}`)
      sellState += onePosting.sellState;
    })

    let totalState = sellState+buyState;

    let middleState =0;
    onePosting.forEach(function(onePosting){
      console.log(`middleState${onePosting.middleState}`)
      middleState+= onePosting.middleState;
    })

    let plusHit = 0;
    onePosting.forEach(function(onePosting){
      if(onePosting.buyState){
      console.log(`현재가 > ${onePosting.pastPrice}`)
      plusHit++;}
    })

    let plusMiss = 0;
    onePosting.forEach(function(onePosting){
      if(onePosting.buyState){
      console.log(`현재가 < ${onePosting.pastPrice}`)
      plusMiss++;}
    })

    let minusHit = 0;
    onePosting.forEach(function(onePosting){
      if(onePosting.sellState){
      console.log(`현재가 > ${onePosting.pastPrice}`)
      plusHit++;}
    })

    let minusMiss = 0;
    onePosting.forEach(function(onePosting){
      if(onePosting.sellState){
      console.log(`현재가 < ${onePosting.pastPrice}`)
      plusMiss++;}
    })

    let standardUnit = 0;
    onePosting.forEach(function(onePosting){
      standardUnit = (onePosting.pastPrice-onePosting.predictPrice)/100
      console.log(`기준단위  ${standardUnit}`)
    })

    // let differenceRate = 0;
    // onePosting.forEach(function(onePosting){
    //   differenceRate = (현재가 - onePosting.predictPrice)/100
    //   console.log(`괴리율  ${differenceRate}`)
    // })

    let pointForAdd = 0;
    onePosting.forEach(function(onePosting){
      pointForAdd = (onePosting.differenceRate/onePosting.standardUnit)
      console.log(`추가될점수  ${pointForAdd}`)
    })
    
    // console.log(`${pastPrice}pastPrice, ${predictPrice}predictPrice, ${buyState}buyState, ${sellState}sellState, ${middleState}middleState,`)
    // if (err) return res.status(500).json({ error: err });
    if (!onePosting) return res.status(404).json({ error: 'accountEmail 없다.' })
    
    // // 이름
    // onePosting[0].accountName
    // // 이메일
    // onePosting[0].accountEmail
    // // 매수 buyState
    // onePosting.buyState
    // // 매도 buyState
    // onePosting.sellState
    // // 중립 middleState
    // onePosting.middleState

    // // +히트
    // if(onePosting.buyState)
    // if(현재가 > onePosting.pastPrice)
    // // +미스
    // if(onePosting.buyState)
    // if(현재가 < onePosting.pastPrice)
    // // -히트
    // if(onePosting.sellState)
    // if(현재가 > onePosting.pastPrice)
    // // -미스
    // if(onePosting.sellState)
    // if(현재가 < onePosting.pastPrice)
    
    // // 기준단위
    // (onePosting.pastPrice - onePosting.predictPrice)/100
    // // 괴리율
    // 현재가 - onePosting.predictPrice
    // // 추가될점수
    // onePosting.differenceRate/onePosting.standardUnit
    // // 최고점
    // Max(onePosting.pointForAdd)
    // // 최저점
    // Min(onePosting.pointForAdd)
    // // 의견총합
    // ALL(onePosting.buyState)+ ALL(onePosting.sellState)
    // 매수비율
    // 매도비율
    // 매수승률
    // 매도승률
    // 최종승률
    res.json(onePosting);
  })
});

router.get("/", function(req, res, next) {
  console.log(`왜안찍혀`+req.user.accountEmail)
  console.log(req.user)
  Posting.find({accountEmail:req.user.accountEmail})
    .then(users => {
      console.log(users)
      // res.json(users);
      res.send(users);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
