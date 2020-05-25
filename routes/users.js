var express = require('express');
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

router.get('/insertUser', function (req, res, next) {
  var param = req.query || req.params;
  pool.getConnection(function(err,conn){
    if(err){
      res.send("code ：-200");
    }else{
      conn.query(userSQL.insert,[param.name,param.account,param.password],function(err,vals,next){
        if(err){
          res.send(err);
        }else{
          var result = {
            code : 200,
            msg : 'success'
          };
        }
        res.send(result);
      })
    }
  })
});

// router.get('/queryOneUser',function(req,res,next){
//   var param = req.query || req.params;
//   pool.getConnection(function(err,conn){
//     if(err){
//       req.send("code : -200");
//     }else{
//       conn.query(userSQL.queryOneUser,[param.account,param.password],function(err,vals,next){
//         if(err){
//           res.send(err);
//         }{
//           // res.send(vals);
//           res.send(param.password);
//         }
//       })
//       conn.release();
//     }
//   })
// })

router.get('/login',function(req,res,next){
  var param = req.query || req.params;
  pool.getConnection(function(err,conn){
    if(err){
      req.send("数据库连接失败");
    }else{
      conn.query(userSQL.queryUser,[param.account],function(err,vals,next){
        if(vals==''){
          res.send(returnJson(0,"该用户不存在",vals));
        }else{
          conn.query(userSQL.validPwd,[param.account,param.password],function(err,vals2,next){
            if(vals2==''){
              res.send(returnJson(-1,"账号或密码错误",vals2));
            }else{
              res.send(returnJson(1,"登录成功",vals2));
            }
          })
        }
      })
    }
  })
})


function returnJson(flag,message,data){
  var response = {
    flag : 0,
    msg : '',
    data: []
  };
  response.flag = flag;
  response.msg = message;
  response.data = data;

  return response;
}
module.exports = router;
