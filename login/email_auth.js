require('dotenv').config()


//메일 인증 모듈화 부분
const nodemailer = require('nodemailer')//pip install nodemailer
const transporter = nodemailer.createTransport({
    service: 'naver',
    host:'smtp.naver.com',
    port: 465,  // SMTP 포트
    auth: {
        user: process.env.MALE_ID, // 이메일 주소
        pass: process.env.MAIL_PASS  //  비밀번호
    }
});
const mailOptions = {
    from: process.env.MALE_ADDRESS,   // 발신자 이메일 주소
    to: process.env.MALE_ADDRESS  // 수신자 이메일 주소
    // subject: `문의 카테고리: ${category}`,
    // text: `이름: ${name}\nEmail: ${email}\n문의 내용:\n${message}`
};
module.exports = {transporter,mailOptions}