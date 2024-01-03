const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const {transporter,mailOptions} =require('./email_auth.js')
const db = require('./db');
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const router = express.Router();

const authRouter = require('./auth');
const authCheck = require('./authCheck.js');
const template = require('./template.js');

const app = express()
const port = 3000


app.set('view engine','ejs')
app.set('views','./public')

app.use(
  express.static(__dirname + "/public"
)
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

app.get('/cam',(request,response) =>{
    response.render('cam')
})

// 인증 라우터
app.use('/auth', authRouter);

// 메인 페이지
// app.get('/main', (req, res) => {
//   if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     res.redirect('/auth/login');
//     return false;
//   }
//   var html = template.HTML('Welcome',
//     `<hr>
//         <h2>메인 페이지에 오신 것을 환영합니다</h2>
//         <p>로그인에 성공하셨습니다.</p>`,
//     authCheck.statusUI(req, res)
//   );
//   res.send(html);
// })

// app.get('/main', (request, response) => {
//   var log_status= 0
//   if (!authCheck.isOwner(request, response)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     response.render('main',{log_status});
//   }
//   log_status=authCheck.isOwner(request)
//   response.render('main',{log_status});
// })

app.get('/main',(request,response) =>{
  response.render('main');
})


app.get('/status', (request,response) =>{
  if(!authCheck.isOwner(request,response)){
    response.redirect('/auth/login');
    return false;
  }
  const html=(`
  <form action="/status_process" method="post">
    <label>섹션 1
    <input type="radio" class="form-check-input" name="item" value="1"> 
    </label>
    <label>섹션 2
    <input type="radio" class="form-check-input" name="item" value="2"> 
    </label>
    <input type="submit" value="확인">
  </form>
  `)
  db.query('SELECT * FROM status', function(error, data){
    if (error) throw error;
    const to_page = []
    data.forEach(function(item){
      to_page.push(item)
    })
    var log_status=authCheck.isOwner(request)
    response.render('status',{html,log_status,to_page : JSON.stringify(to_page)})
  })
  
})


app.post('/status_process',(request,response) =>{
  const section = request.body.item
  if(!authCheck.isOwner(request,response)){
    response.redirect('/auth/login');
    return false;
  }
  // const html =(``)
  var log_status=authCheck.isOwner(request)
  db.query('SELECT * FROM status WHERE section = ?', [section],function (error, data){
    if (error) throw error;
    response.render("status_result",{data,log_status})
  })
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