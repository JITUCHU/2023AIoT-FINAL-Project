var express = require('express');
var router = express.Router();

const crypto = require('crypto')//비밀번호 암호화하여 저장하기위한 모듈
const nodemailer = require('nodemailer')
const {transporter,mailOptions} =require('./email_auth.js')
var template = require('./template.js');
// var db = require('./db');
const authCheck = require('./authCheck.js');


// 로그인 화면
router.get('/login', function (request, response) {
    var html = (`
            <h2>로그인</h2> 
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="id" placeholder="아이디"></p>
            <p><input class="login" type="password" name="pass" placeholder="비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>            
            <p>계정이 없으신가요?  <a href="/auth/question">관리자에게 문의하기</a></p>
            <p>계정이 없으신가요?  <a href="/auth/register">회원 가입하기</a></p> 
            `);
    var log_status=authCheck.isOwner(request)
    response.render('login',{html,log_status});
});


router.post('/login_process', function (request, response) {
    var username = request.body.id;
    var password = request.body.pass;

    if (username && password) {
        db.query('SELECT * FROM usertable WHERE id = ?', [username], function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                const storedPasswordHash = results[0].pass;
                const storedSalt = results[0].salt;

                // 입력된 비밀번호와 저장된 salt를 이용하여 해싱
                const hashedPassword = crypto.pbkdf2Sync(password, storedSalt, 10000, 64, 'sha256').toString('hex');

                // 저장된 해시값과 입력된 비밀번호의 해시값 비교
                if (hashedPassword === storedPasswordHash) {
                    // 로그인 성공
                    request.session.is_logined = true;
                    request.session.nickname = username;
                    request.session.save(function () {
                        response.redirect(`/`);
                    });
                } else {
                    // 비밀번호 불일치
                    response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                    document.location.href="/auth/login";</script>`);
                }
            } else {
                // 해당 아이디가 없음
                response.send(`<script type="text/javascript">alert("존재하지 않는 아이디 입니다."); 
                document.location.href="/auth/login";</script>`);
            }
        });

    } else {
        // 아이디와 비밀번호 입력 요청
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);
    }
});


// 로그아웃
router.get('/logout', function (request, response) {
    
    request.session.destroy(function (err) {
        response.redirect('/');
    });
});



// 관리자에게 문의하기
router.get('/question', function(request, response) {  
    var html =(`
    <div id="contact">
        <h1>관리자 문의 페이지</h1>
        <form action="/auth/question_prosess" method="post">
            <fieldset>
                <label for="category">문의 종류 :</label>
                    <select name="category" >
                    <option value="sign_up" >페이지 권한 요청</option>
                    <option value="login_erorr" >로그인 불가</option>
                    <option value="find_id" >아이디 찾기</option>
                    <option value="find_pass" >비밀번호 찾기</option>
                    <option value="etc" >기타</option>
                    </select>
                <label for="name">이름 :</label>
                <input type="text" id="name" name="name" placeholder="Enter your full name" />
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" />
                
                <label for="message">문의 내용 :</label>
                <textarea id="message" name="message" placeholder="What's on your mind?"></textarea>
                
                <input type="submit" value="제출 하기" />

            </fieldset>
        </form>
    </div>
    `);
    var log_status=authCheck.isOwner(request)
    response.render('question',{html,log_status});
});


router.post('/question_prosess', function(request, response){
    const category =request.body.category
    const name =request.body.name
    const email = request.body.email
    const message = request.body.message
    if (name && email && message){
        mailOptions.subject= `문의 카테고리: ${category}`
        mailOptions.text = `이름: ${name}\nEmail: ${email}\n문의 내용:\n${message}`
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error(error);
                response.send(`<script type="text/javascript">alert("이메일 발송중 오류가 발생하였습니다!"); 
                document.location.href="/auth/question";</script>`);
            } else {
                console.log('Email sent: ' + info.response);
                response.send(`<script type="text/javascript">alert("문의가 성공적으로 제출되었습니다!"); 
                document.location.href="/auth/question";</script>`);
            }
        });
    } else{
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/question";</script>`);
    }

    
});



// // 회원가입 화면
// router.get('/register', function(request, response) {
//     const title = '회원가입';
      
//     const html = (`
//         <h2>회원가입</h2>
//         <form action="/auth/register_process" method="post">
//         <p><input class="login" type="text" name="name" placeholder="이름"></p>
//         <p><input class="login" type="text" name="id" placeholder="아이디"></p>
//         <p><input class="login" type="password" name="pass" placeholder="비밀번호"></p>    
//         <p><input class="login" type="password" name="pass2" placeholder="비밀번호 재확인"></p>
//         <p><input class="btn" type="submit" value="제출"></p>
//         </form>            
//         <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
//         `);
//     var log_status=authCheck.isOwner(request)
//     response.render('register',{html,log_status});
// });


 
// // 회원가입 프로세스
// router.post('/register_process', function(request, response) {    
//     var username = request.body.name;
//     var userid = request.body.id;
//     var password = request.body.pass;
//     var password2 = request.body.pass2;
//     const now =new Date()  
//     //회원가입 창에서 입력받은 비밀번호 암호화 하기
//     const salt = crypto.randomBytes(16).toString('hex');
//     const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');

//     if (username && userid && password && password2) {
        
//         db.query('SELECT * FROM usertable WHERE id = ?', [userid], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
//             if (error) throw error;
//             if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
//                 db.query('INSERT INTO usertable (username ,id, pass, salt,CreatedAt) VALUES(?,?,?,?,?)', [username, userid, hashedPassword, salt,now], function (error, data) {
//                     if (error) throw error;
//                     response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
//                     document.location.href="/";</script>`);
//                 });
//             } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
//                 response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
//                 document.location.href="/auth/register";</script>`);    
//             }
//             else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
//                 response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
//                 document.location.href="/auth/register";</script>`);    
//             }            
//         });

//     } else {        // 입력되지 않은 정보가 있는 경우
//         response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
//         document.location.href="/auth/register";</script>`);
//     }
// });

module.exports = router;