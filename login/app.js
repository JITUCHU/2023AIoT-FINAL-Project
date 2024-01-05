const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const {transporter,mailOptions} =require('./email_auth.js')
const db = require('./db');

const QR = require('qrcode')

const router = express.Router();

// 물류 물품 CRUD 관련 설정 코드
const qr = require('qrcode');
const mysql = require('mysql2');
// 여기까지 240104 PM JS

const authRouter = require('./auth');
const authCheck = require('./authCheck.js');


const app = express();
const port = 3000

<<<<<<< HEAD
app.set('view engine','ejs');
=======

app.set('view engine','ejs')
>>>>>>> e4c01c0347141090cb1fbf8236c1445840436f9f
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

app.get('/cam',(request,response) =>{
    response.render('cam')
})

// 인증 라우터
app.use('/auth', authRouter);


<<<<<<< HEAD
=======
// app.get('/main', (request, response) => {
<<<<<<< HEAD
//   if (!authCheck.isOwner(request, response)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     response.redirect('/auth/login');
//     return false;
//   }
//   var log_status=authCheck.isOwner(request)
=======
//   var log_status= 0
//   if (!authCheck.isOwner(request, response)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
//     response.render('main',{log_status});
//   }
//   log_status=authCheck.isOwner(request)
>>>>>>> e4c01c0347141090cb1fbf8236c1445840436f9f
//   response.render('main',{log_status});
// })
>>>>>>> 1219764c018d6b8f9e17595157a76616237a0a4f

app.get('/main',(request,response) =>{
  response.render('main');
})

<<<<<<< HEAD
=======

>>>>>>> e4c01c0347141090cb1fbf8236c1445840436f9f
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

<<<<<<< HEAD
=======

>>>>>>> 1219764c018d6b8f9e17595157a76616237a0a4f
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

<<<<<<< HEAD
app.post('/QRcreate_prosess', (req, res) => {
  const type = req.body.type;
  const barcode = req.body.number;
  const name = req.body.name;
  const barcodeInfo = `${type} ${barcode}`;
  let location=0
  if(type == "digital" || type == "books" ){
    location = 1;
  }
  else{
    location = 2;
  }
  // console.log(barcodeInfo);
  // console.log(barcode);
  // console.log(name);
  // console.log(location)
=======
app.post('/QRcreate_progress', (req, res) => {
  const type = req.body.type;
  const barcode = req.body.serialNumber;
  const name = req.body.name;
  const barcodeInfo = `${type} ${serialNumber}`;
  console.log(type);
  console.log(barcode);
  console.log(name);
>>>>>>> 1219764c018d6b8f9e17595157a76616237a0a4f

  db.query('SELECT * FROM barcodes WHERE barcode = ?', [barcodeInfo], (error, results) => {
    if (error) throw error;
    
    if (results.length > 0) {
<<<<<<< HEAD
      res.send(`<script type="text/javascript">alert("이미 존재하는 바코드 입니다."); 
      document.location.href="/QRcreate";</script>`);
    } else {
    //   QR.toDataURL(barcodeInfo,(err, url) => {
    //     const data = url.replace(/.*,/, "");
    //     const img = new Buffer.from(data, "base64");
    //     res.writeHead(200, {
    //       "Content-Type": "image/png",
    //       "Content-Length": img.length
    //     })
    // })
      db.query('INSERT INTO barcodes (`type`, `barcode_key`, `barcode`) VALUES (?,?,?)', [type,barcode ,barcodeInfo], (insertError) => {
        if (insertError) throw insertError;
        db.query('INSERT INTO product (`type`, `product_name`, `location`, `barcode`) VALUES (?,?,?, ?)', [type,name,location,barcodeInfo], (productError) => {
          if (productError) throw productError;
          
          res.send(`<script type="text/javascript">alert("입력 완료 !"); 
          document.location.href="/QRcreate";</script>`);
        });
      })
=======
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
>>>>>>> 1219764c018d6b8f9e17595157a76616237a0a4f
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

<<<<<<< HEAD
=======

>>>>>>> 1219764c018d6b8f9e17595157a76616237a0a4f
app.all("/*", (request,response) => {
  response.status(404).json({
      "status" : 404,
      "message" : "BAD REQUEST!"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})