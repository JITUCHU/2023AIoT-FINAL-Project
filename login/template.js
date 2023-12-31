module.exports = {
    HTML: function (title, body, authStatusUI) {
      return `
      <!doctype html>
      <html>
      <head>    
        <title>Login TEST - ${title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <style>
          @import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
  
          body {
              font-family: 'JalnanGothic';
              background-color: #AAA2C2;
              margin: 50px;
  
          }
          @font-face {
              font-family: 'JalnanGothic';
              src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff') format('woff');
              font-weight: normal;
              font-style: normal;
          }
          @font-face {
              font-family: 'yg-jalnan';
              src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
              font-weight: normal;
              font-style: normal;
          }
          option{
            background-color: #5E768D;
          }
  
          .background {
              background-color: white;
              height: auto;
              width: 90%;
              max-width: 620px;
              padding: 10px;
              margin: 100px auto;
              border-radius: 5px;
              box-shadow: 0px 40px 30px -20px rgba(0, 0, 0, 0.3);
              text-align: center;
          }
  
          form {
              display: flex;
              padding: 30px;
              flex-direction: column;
          }
  
          .login {
              border: none;
              border-bottom: 2px solid #D1D1D4;
              background: none;
              padding: 10px;
              font-weight: 200;
              transition: .2s;
              width: 75%;
          }
          .login:active,
          .login:focus,
          .login:hover {
              outline: none;
              border-bottom-color: #6A679E;
          }
  
          .btn {            
              border: none;
              width: 75%;
              background-color: #6A679E;
              color: white;
              padding: 15px 0;
              font-weight: 300;
              border-radius: 5px;
              cursor: pointer;
              transition: .2s;
          }
          .btn:hover {
              background-color: #595787;
          }
          body, div, h1, form, fieldset, input, textarea {
            margin: 0; padding: 0; border: 0; outline: none;
          }
          
          html {
            height: 100%;
          }
          
          body {
            background: #728eaa;
            background: -moz-linear-gradient(top, #25303C 0%, #728EAA 100%); /* firefox */	
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#25303C), color-stop(100%,#728EAA)); /* webkit */
            font-family: JalnanGothic; 
          }
          
          #contact {
            width: 560px; margin: auto; padding: 60px 30px;
            background: #c9d0de; border: 1px solid #e1e1e1;
            -moz-box-shadow: 0px 0px 8px #444;
            -webkit-box-shadow: 0px 0px 8px #444;
          }
          
          h1 {
            font-size: 35px; color: #445668; text-transform: uppercase;
            text-align: center; margin: 0 0 35px 0; text-shadow: 0px 1px 0px #f2f2f2;
          }
          
          label {
            float: left; clear: left; margin: 11px 20px 0 0; width: 95px;
            text-align: right; font-size: 16px; color: #445668; 
            text-transform: uppercase; text-shadow: 0px 1px 0px #f2f2f2;
          }
          
          input {
            width: 260px; height: 35px; padding: 5px 20px 0px 20px; margin: 0 0 20px 0; 
            background: #5E768D;
            background: -moz-linear-gradient(top, #546A7F 0%, #5E768D 20%); /* firefox */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#546A7F), color-stop(20%,#5E768D)); /* webkit */
            border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;
            -moz-box-shadow: 0px 1px 0px #f2f2f2;-webkit-box-shadow: 0px 1px 0px #f2f2f2;
            font-family: 'JalnanGothic'; font-size: 18px; color: #353535; text-shadow: 0px -1px 0px #334f71; 
          }
            input::-webkit-input-placeholder  {
                color: #a1b2c3; text-shadow: 0px -1px 0px #38506b;  
            }
            input:-moz-placeholder {
                color: #a1b2c3; text-shadow: 0px -1px 0px #38506b; 
            }
            select {
              width: 300px; height: 40px; padding: 5px 20px 0px 20px; margin: 0 0 20px 0; 
              background: #5E768D;
              background: -moz-linear-gradient(top, #546A7F 0%, #5E768D 20%); /* firefox */
              background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#546A7F), color-stop(20%,#5E768D)); /* webkit */
              border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;
              -moz-box-shadow: 0px 1px 0px #f2f2f2;-webkit-box-shadow: 0px 1px 0px #f2f2f2;
              font-family: 'JalnanGothic'; font-size: 16px; color: #f2f2f2; text-shadow: 0px -1px 0px #334f71; 
            }
          textarea {
            width: 260px; height: 170px; padding: 12px 20px 0px 20px; margin: 0 0 20px 0; 
            background: #5E768D;
            background: -moz-linear-gradient(top, #546A7F 0%, #5E768D 20%); /* firefox */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#546A7F), color-stop(20%,#5E768D)); /* webkit */
            border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;
            -moz-box-shadow: 0px 1px 0px #f2f2f2;-webkit-box-shadow: 0px 1px 0px #f2f2f2;
            font-family: 'JalnanGothic'; font-size: 16px; color: #f2f2f2; text-shadow: 0px -1px 0px #334f71; 
          }
            textarea::-webkit-input-placeholder  {
                color: #a1b2c3; text-shadow: 0px -1px 0px #38506b;  
            }
            textarea:-moz-placeholder {
                color: #a1b2c3; text-shadow: 0px -1px 0px #38506b; 
            }
            
          input:focus, textarea:focus {
            background: #728eaa;
            background: -moz-linear-gradient(top, #668099 0%, #728eaa 20%); /* firefox */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#668099), color-stop(20%,#728eaa)); /* webkit */
          }
          
          input[type=submit] {
            width: 185px; height: 52px; float: right; padding: 10px 15px; margin: 0 15px 0 0;
            -moz-box-shadow: 0px 0px 5px #999;-webkit-box-shadow: 0px 0px 5px #999;
            border: 1px solid #556f8c;
            background: -moz-linear-gradient(top, #718DA9 0%, #415D79 100%); /* firefox */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#718DA9), color-stop(100%,#415D79)); /* webkit */
            cursor: pointer;
          }
      </style>
      </head>
      <body>
      <nav class="navbar navbar-expand-sm bg-light navbar-light">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" href="#">Active</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="/auth/login">1</a>
            </li>
          </ul>
        </div>
      </nav>
        <div class="background">
          ${authStatusUI}
          ${body}
        </div>
      </body>
      </html>
      `;
    }
  }