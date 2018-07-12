var express = require('express');
var Router = express.Router();
var user = require('../models/users');
var jwt = require('jsonwebtoken');
var nodeMailer = require('nodemailer');
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var verifyToken = jwt.sign({ foo: 'bar' }, 'secret');
var resetToken = jwt.sign({ foo2: 'bar2' }, 'secret2',{expiresIn:'1h'});
var resetLink,verifyLink;

// Thiết lập NodeMailer
var transporter = nodeMailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'toanpro7x@gmail.com',
        pass:'lncbhenspsdlgous'
    }
});


//Trang GET reset TOKEN
Router.get('/reset/:getResetToken--:id',function (req,res) {
    res.render('chargepass');
});

//Trang POST reset TOKEN
Router.post('/reset/:getResetToken--:id',function (req,res,next) {
    var getResetToken = req.params.getResetToken;
    var Id = req.params.id;
var Pass = req.body.pass,
    Pass2 = req.body.pass2;

if (Pass == Pass2){
    user.update({"password":Pass},{where:{id:Id}}).then(function (dulieupass) {
        res.redirect('/');
        return
    })
}else {
    res.send('vui long xem lai pass');
}
});


//Trang GET Quên Mật khẩu
Router.get('/forgot',function (req,res) {
    res.render('sendMail');
});

// Trang POST quên mật khẩu
Router.post('/forgot',function (req,res,next) {
  if (req.body.email){

      user.findOne({where:{email:req.body.email}}).then(function (dulieuReset) {
              var idDuLieu = dulieuReset.id;
              jwt.verify(resetToken,'secret2',function (err,decode) {
                  if (err){console.log(err);
                      return resetLink="http://localhost:3000/error";
                  }else{
                      return resetLink="http://localhost:3000/reset/"+resetToken+"--"+idDuLieu;
                  }
              });

              var Conten1 = {
                  from:'"Hackers"<toanpro7x@gmail.com>',
                  to:req.body.email,
                  subject:'Hello',
                  text:'hello word',
                  html:'<a href='+resetLink+'>ResetPassword</a>'
              } ;


              transporter.sendMail(Conten1, function (error, info) {
                  if (error){
                      return console.log(error);
                  } else{
                      console.log('message was send');
                  }
              });
              res.send('ban vui long check lai mail');
      })

  }else{
      res.send('Vui long nhap lai email');
  }
});


// Trang GET vui lòng check email
Router.get('/send',function (req,res) {
res.render('send');
});


//Trang GET báo lỗi
Router.get('/error',function (req,res) {
   res.render('error');
});


// TRANG GET check TOKEN MAIL đăng ký
Router.get('/verify/:getVerifyToken',function (req,res) {
        user.update({"status":"active"},{where:{"token":req.params.getVerifyToken}}).then(function (dat) {
          res.render('success');
        })
});


// TRANG GET hiển thị LOGIN
Router.get('/',function (req,res) {
    if (req.session.user){
        res.redirect('/admin');
        return
    }
    res.render('login');

});
//Trang dang ky
Router.get('/test',function (req,res) {
   res.render('test');
});


// TRANG POST hiển thị LOGIN
Router.post('/', function (req,res) {
   var userName = req.body.user,
       passWord = req.body.pass;

   user.findAndCountAll({where:{
       "username":userName,
        "password":passWord,
           "status":"active"
       }}).then(function (data) {

       if (data.count > 0) {
           req.session.user = userName;
           req.session.pass = passWord;
           if (req.session.user) {
               res.redirect('/admin');
               return
           } else {
               res.redirect('/');
               return
           }
       } else {
           res.render('login',{
               Loi:"tai khoan hoac mat khau khong chinh xac"
           });
       }
   });
});


// TRANG GET hiển thị trang chủ
Router.get('/admin', function (req,res) {
   res.render('index',{
       User: req.session.user
   });
});


// TRANG GET hiển thị đăng ký
Router.get('/register',function (req,res) {
    if (req.session.user || req.session.pass){
        res.redirect('/admin');
        return
    }
else{
        res.render('register');
    }


});

// TRANG POST hiển thị đăng ký
Router.post('/register',function (req,res,next) {
    var username = req.body.user,
        password = req.body.pass,
        fullname = req.body.full,
        email = req.body.email;
    if (username && password && fullname && email){
        user.create({
            username:username,
            password:password,
            fullname:fullname,
            email:email,
            token:verifyToken,
            status:'unactive'
        }).then(function (err,dulieu) {
             if (err){
                 console.log(err);
             } else{
                 console.log('success');
             }
             next();
        }).then(
            function () {
                jwt.verify(verifyToken,'secret',function (err,decode) {
                    if (err){console.log(err);
                        return verifyLink="http://localhost:3000/error";
                    }else{
                        return verifyLink="http://localhost:3000/verify/"+verifyToken;
                    }
                });

               var Conten2 = {
                    from:'"Hackers"<toandq99@gmail.com>',
                    to:req.body.email,
                    subject:'Hello',
                    text:'hello word',
                    html:'<a href='+verifyLink+'>Rigister</a>'
                } ;


                transporter.sendMail(Conten2, function (error, info) {
                    if (error){
                        return console.log(error);
                    } else{
                        console.log('message was send');
                    }
                });
                res.redirect('/send');
            }
        )
    }else {
        res.send('ban chua dien day du thong tin, vui long thu lai');
    }

});


// TRANG GET phần đăng xuất
Router.get('/logout',function (req,res) {
    if (req.session.user){
        req.session.destroy(function (err) {
            if (err){console.log(err)}else{
                console.log('success');
                res.redirect('/');
                return
            }
        })
    }
});
module.exports = Router;
