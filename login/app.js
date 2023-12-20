const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
// const {transporter,mailOptions} =require('./email_auth.js')
// const db = require('./db');
// const nodemailer = require('nodemailer')
// const crypto = require('crypto')

// const router = express.Router();

const authRouter = require('./auth');
const authCheck = require('./authCheck.js');
// const template = require('./template.js');

const app = express()
const port = 3000

app.set('view engine','ejs')
app.set('views','./public')

app.use(
  express.static(__dirname + "/public")
)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '~~~',	// 원하는 문자 입력
  resave: false,
  saveUninitialized: true,

}))

app.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  } else {                                      // 로그인 되어있으면 메인 페이지로 이동시킴
    res.redirect('/main');
    return false;
  }
})

// 인증 라우터
app.use('/auth', authRouter);

// 메인 페이지
// app.get('/main', (req, res) => {
//   if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     res.redirect('/auth/login');
//     return false;
//   }
// })

app.get('/main', (request, response) => {
  if (!authCheck.isOwner(request, response)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    response.redirect('/auth/login');
    return false;
  }
  welcome = authCheck.statusUI(request)
  var log_status=authCheck.isOwner(request)
  response.render('main',{welcome,log_status});
})

app.all("/*", (request,response) => {
  response.status(404).json({
      "status" : 404,
      "message" : "BAD REQUEST!"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})