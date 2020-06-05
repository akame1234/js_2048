var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();


var mysql = require('mysql');
var dbconfig = require('../db/DBConfig');
var userSQL = require('../db/User/usersql');

//创建数据库连接池
var pool = mysql.createPool(dbconfig.mysql);





router.get('/queryAllUser', function (req, res, next) {
  pool.getConnection(function (err, conn) {
    if (err) {
      res.send("code : -200");
    } else {
      conn.query(userSQL.queryAll, function (err, vals, next) {
        if (err) {
          res.send(err);
        }
        res.send(vals);
        conn.release();
      })
    }
  })
});
router.post('/login',function(req,res,next){
  var account = req.body.account;
  var password = req.body.password;
  pool.getConnection(function(err,conn){
    if(err){
      req.send("数据库连接失败");
    }else{
      conn.query(userSQL.queryUser,[account],function(err,vals,next){
        if(vals==''){
          res.send(returnJson(0,'该用户不存在',vals));
        }else{
          conn.query(userSQL.validPwd,[account,password],function(err,vals2,next){
            if(vals2 == ''){
              res.send(returnJson(-1,'账号或密码错误',vals2));
            }else{
              var tokenid = jwt.sign({ account : account},"ctk",{expiresIn : 1800});
              res.send(returnJson(1,"登录成功",vals2,tokenid));
            }
            conn.release();
          })
        }
      })
    }
  })
});

router.post('/register',function(req,res,next){
  var account = req.body.account;
  var password = req.body.password;
  var name = req.body.name;
  var score = 0;
  pool.getConnection(function(err,conn){
    if(err){
      req.send("数据库连接失败");
    }else{
      conn.query(userSQL.insert,[name,account,password,score],function(err,vals,next){
        res.send(returnJson(1,'注册成功',vals));
        conn.release();
      })
    }
  })
})

router.post('/getScore',function(req,res,next){
  var name = req.body.name;
  pool.getConnection(function(err,conn){
    if(err){
      req.send("数据库连接失败");
    }else{
      conn.query(userSQL.queryScore,[name],function(err,vals,next){
        if(vals==''){
          res.send(returnJson(0,'该用户未进行过游戏',vals));
        }else{
          res.send(returnJson(1,'该用户分数为',vals));
        }
        conn.release();
      })
    }
  })
});

router.post('/getAllScore',function(req,res,next){
  pool.getConnection(function(err,conn){
    if(err){
      req.send('数据库连接失败');
    }else{
      conn.query(userSQL.queryAllScore,function(err,vals,next){
        if(vals==''){
          res.send(returnJson(0,'还没有用户进行过游戏',vals));
        }else{
          res.send(returnJson(1,'所有分数为',vals));
        }
        conn.release();
      })
    }
  })
});

router.post('/replaceScore',function(req,res,next){
  var name = req.body.name;
  var newScore = req.body.score;
  pool.getConnection(function(err,conn){
    if(err){
      req.send("数据库连接失败");
    }else{
      conn.query(userSQL.updataScore,[newScore,name,newScore],function(errs,vals,next){
        if(errs){
          res.send('数据库连接失败');
        }else{
          res.send(returnJson(1,"注册成功",vals));
        }
        conn.release();
      })
    }
  })
})




function returnJson(flag,message,data,tokenid){
  var response = {
    flag : 0,
    msg : '',
    data: [],
    tokenid
  };
  response.flag = flag;
  response.msg = message;
  response.data = data;
  response.tokenid = tokenid;

  return response;
}
module.exports = router;
