var express = require('express')
var static = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var router = express.Router();
var expressSession = require('express-session');

var app = express();
var ejs = require('ejs');


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('views', __dirname + '/views' );
app.set('view engine', 'ejs');

app.get('/process/setUserCookie', (req, res) => {
  console.log('/process/setUserCookie called.');

  res.cookie('user', {
    id: 'mike',
    name: 'Yo',
    authorized: true

  });

  res.redirect('/process/showCookie');


});

app.get('/process/showCookie', (req, res) => {
  console.log('/process/showCookie 호출됨');

  res.send(req.cookies);
});

app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

app.get('/productlist', (req, res) => {
  var obj = JSON.parse('[{"apple":"10000"}, {"banana":"20000"}]');
  res.status(200).send(obj);
});

app.post('/process/login', (req, res ) => {
  console.log('/process/login 호출됨');

  var paramaId= req.body.id || req.query.id;
  var paramaPassword = req.body.password || req.query.password;

  if (req.session.user) {
    console.log('이미 로그인되어 상품 페이지로 이동합니다.');

    res.redirect('/public/product.html');
    return;
  } else {
    //세션 저장
    req.session.user = {
      id: paramaId,
      name: 'good',
      authorized: true
    };
  }

  res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
  var username = "boky"
  var context ={userid: paramaId, username: username};
  req.app.render('login_success', context, function(err, html) {
    if(err) {
      console.error('뷰 렌더링 중 오류 발생:' + err.stack);
      res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
      res.write('<p>' + err.stack + '</p>');
      res.end();
      return;
    }
    console.log('rended: '+ html);
    res.end(html);
  });
});
  

app.get('/process/logout', (req, res) => {
  console.log('/process/logout 호출됨.');

  if (req.session.suer) {
    //로그인 된 상태
    console.log('로그아웃합니다.');

    req.session.destroy(function (err) {
      if (err) { throw err; }

      console.log('세션을 삭제하고 로그아웃되었습니다.');
      res.redirect('/public/login.html');
    });

  } else {
    //로그인 안된 상태
    console.log('아직 로그인되어있지 않습니다.');

    res.redirect('/public/login.html');
  }
})

app.get('/process/product', (req, res) => {
  console.log('/process/product 호출됨.');

  if (req.session.user) {
    res.redirect('/public/product.html');

    
  }
  else {
    res.redirect('/public/login.html');
  }
  
});

app.get("/ejs", (req, res)=> {
  console.log('putdowm');
  var context = {title: '사용자 추가 성공'};
req.app.render('content', context, function(err, html) {
  if(err){
    console.log(err.stack);

  }

  res.end(html);
});
});



app.listen(app.get('port'), function () {
  console.log('익스프레스 서버를 시작했습니다:' + app.get('port'));
});




