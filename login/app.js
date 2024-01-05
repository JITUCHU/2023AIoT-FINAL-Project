const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const {transporter,mailOptions} =require('./email_auth.js')
const db = require('./db');
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const router = express.Router();

// 물류 물품 CRUD 관련 설정 코드
const qr = require('qrcode');
const mysql = require('mysql2');
// 여기까지 240104 PM JS

const authRouter = require('./auth');
const authCheck = require('./authCheck.js');
const template = require('./template.js');

const app = express();
const port = 3000

app.set('view engine','ejs');
app.set('views','./public')

app.use(
  express.static(__dirname + "/public"
)
)

// 240104 JS 수정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
})
// 여기까지

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
    // res.redirect('/main');
    // return false;
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
//   var html = template.HTML('Welcome',
//     `<hr>
//         <h2>메인 페이지에 오신 것을 환영합니다</h2>
//         <p>로그인에 성공하셨습니다.</p>`,
//     authCheck.statusUI(req, res)
//   );
//   res.send(html);
// })

// app.get('/main', (request, response) => {
//   if (!authCheck.isOwner(request, response)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     response.redirect('/auth/login');
//     return false;
//   }
//   var log_status=authCheck.isOwner(request)
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
  // const html=(`
  // <ul class="list">
  //   <li class="list__item">
  //     <input type="radio" class="radio-btn" name="item" id="a-opt" />
  //     <label for="a-opt" class="label">1구역</label>
  //   </li>
    
  //   <li class="list__item">
  //     <input type="radio" class="radio-btn" name="item" id="b-opt" />
  //     <label for="b-opt" class="label">2구역</label>
  //   </li>
  //   <input type="submit" value="확인">
  // </ul>
  // `)
  var log_status=authCheck.isOwner(request)
  response.render('status',{html,log_status})
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


// QR 생성하기
app.get('/QRcreate', function(request, response) {  
  var html =(`
  <div id="contact">
      <h1>QR 코드 생성 및 등록</h1>
      <form id="crudForm" action="/QRcreate_prosess" method="post">
          <fieldset>
              <label for="type">품목 :</label>
              <select name="type">
                <option value="books">books</option>
                <option value="clothes">clothes</option>
                <option value="digital">digital</option>
                <option value="food">food</option>
              </select>
              <label for="product_name">물품 이름 :</label>
              <input type="text" id="name" name="name" placeholder="물품 이름을 입력하세요." />
              <label for="barcodeKey">일련번호 :</label>
              <input type="text" id="number" name="number" placeholder="숫자 4~6자리를 입력하세요." />
              
              <input type="submit" value="생성하기" />

          </fieldset>
      </form>

  <div id="qrCode"></div>
  </div>
  `);
  var log_status=authCheck.isOwner(request)
  response.render('QRcreate',{html,log_status});
});

app.post('/QRcreate_progress', (req, res) => {
  const type = req.body.type;
  const barcode = req.body.serialNumber;
  const name = req.body.name;
  const barcodeInfo = `${type} ${serialNumber}`;
  console.log(type);
  console.log(barcode);
  console.log(name);

  db.query('SELECT * FROM barcodes WHERE barcode = ?', [barcodeInfo], (error, results) => {
    if (error) throw error;
    
    if (results.length > 0) {
      res.render('QRcreate', { message: '이미 존재하는 QR코드 정보입니다.' });
    } else {
      qr.toDataURL(barcodeInfo, (qrErr, url) => {
        if (qrErr) throw qrErr;
        
        db.query('INSERT INTO barcodes (barcode) VALUES (?)', [barcodeInfo], (insertError) => {
          if (insertError) throw insertError;
          
          db.query('INSERT INTO product (barcode, name) VALUES (?, ?)', [barcodeInfo, productName], (productError) => {
            if (productError) throw productError;
            
            res.render('QRcreate_progress', { qrImage: url });
          });
        });
      });
    }
  });
});

// QR 검색하기
app.get('/QRresearch', function(request, response) {  
  var html =(`
  <div id="contact">
      <h1>QR 코드 검색</h1>
      <form id="crudForm" action="/QRresearch_prosess" method="post">
          <fieldset>
              <label for="type">품목 :</label>
              <select name="type">
                <option value="books">books</option>
                <option value="clothes">clothes</option>
                <option value="digital">digital</option>
                <option value="food">food</option>
              </select>
              <input type="submit" value="검색하기" />

          </fieldset>
      </form>
      <div id="barcodeList"></div>
  </div>
  `);
  var log_status=authCheck.isOwner(request)
  response.render('QRresearch',{html,log_status});
});


// QR 삭제하기
app.get('/QRdelete', function(request, response) {  
  var html =(`
  <div id="contact">
      <h1>QR 코드 삭제</h1>
      <form id="crudForm" action="/QRdelete_prosess" method="post">
          <fieldset>
              <label for="type">품목 :</label>
              <select name="type">
                <option value="books">books</option>
                <option value="clothes">clothes</option>
                <option value="digital">digital</option>
                <option value="food">food</option>
              </select>
              <label for="barcodeKey">일련번호 :</label>
              <select name="number" id="number">
              </select>
              <input type="submit" value="삭제하기" />

          </fieldset>
      </form>

  <div id="qrCode"></div>
  </div>
  `);
  var log_status=authCheck.isOwner(request)
  response.render('QRdelete',{html,log_status});
});


app.all("/*", (request,response) => {
  response.status(404).json({
      "status" : 404,
      "message" : "BAD REQUEST!"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})