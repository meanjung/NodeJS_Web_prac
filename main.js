var express=require('express');
var template=require('./template.js');
var mysql=require('mysql');
var qs=require('querystring');
var bodyParser=require('body-parser');
var app=express();
var session = require('express-session')
var FileStore=require('session-file-store')(session)
var db=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '000000',
  database: 'myweb'
});
db.connect();

app.use(bodyParser.urlencoded({ extended:false }));
app.use(session({
  secret: 'woIgb&#^$GsbjH%#^',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
/*
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {
    usernameField: 'id',
    passwordField: 'pwd'
  },
  function(username, password, done){
    console.log(username, password);
  }
));

app.post('/login_process', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'
}));
*/
var authData={
  id: 'minjung',
  password: '000000',
  nickname: 'minjeong'
}

function authIsOwner(request, response){
  if(request.session.is_logined){
    return true;
  }else{
    return false;
  }
}

function status(request, response){
  var status='<a href="/login">login</a>';
//  console.log("authIsOwner: ",authIsOwner(request,response));
  if(authIsOwner(request, response)){
    status=`${request.session.nickname}  <a href="/logout">logout</a>`;
  }
  return status;
}

app.get('/',function(request, response){
  var html=template.HTML(" ","Welcome to my diary","Click Something",status(request, response));
  response.send(html);
})

app.get('/login', function(request, response){
  var html=template.HTML(`
    <form action="/login_process" method="post">
      <p><input type="text" name="id" placeholder="id"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p><input type="submit" value="login"></p>
    </form>
    `,"Welcome to my diary","Login Please"," ");
    response.send(html);
})

app.get('/log', function(request, response){
  db.query(`select * from log order by date;`,function(error,logs){
    if(error) {
      throw error;
    }
    var html2=`<p>`;
    logs.forEach(function(rows){
      html2+=`
      <div style="margin-left: 20px; border: 1px solid;">
        작성자 ${rows.author}
        <a href="/revise/${rows.author}">수정</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${rows.author}">
          <input type="submit" name="delete" value="삭제">
        </form>
      </div>
      <div style="margin-left: 20px;">
        ${rows.content}
      </div>
      <br>
      `
    });
    html2+=`</p>`;
    var html=template.HTML("log","방명록",`
    ${html2}
    <form action="/log_upload" method="post">
      <div style="margin-left: 20px; margin-bottom: -10px;">
        작성자 <input type="text" name="name" style="resize:none; margin-top: 10px; width:100px;" maxlength="10">
      </div>
      <br>
      <textarea name="log" style="resize: none; margin-left: 20px;" rows="4" cols="100"></textarea>
      <input type="submit" value="올리기">
    </form>
    `,status(request, response));
    response.send(html);
  });
})


app.post('/log_upload', function(request, response){
  if(!authIsOwner(request, response)){
    response.redirect('/');
    return false;
  }
  var post=request.body;
  db.query(`insert into log (author, content, date) values(?,?,NOW())`,[post.name, post.log], function(error,result){
        if(error) {
           throw error;
         }
        response.writeHead(302,{Location: `/log`});
        response.end();
        //response.redirect(302, '/log');
  });
})


app.get('/revise/:pageId',function(request, response){
  if(!authIsOwner(request, response)){
    response.redirect('/');
    return false;
  }
  db.query(`select * from log order by date;`,function(error,logs){
    if(error) {
      throw error;
    }
    var html2=`<p>`;
    logs.forEach(function(rows){
      html2+=`
      <div style="margin-left: 20px; border: 1px solid;">
        작성자 ${rows.author}
        <a href="/revise/${rows.author}">수정</a>
        <form action="/delete_process" method="post">
          <input type="submit" name="delete" value="삭제">
        </form>
      </div>
      <div style="margin-left: 20px;">
        ${rows.content}
      </div>
      <br>
      `
    });
    var writer=request.params.pageId;
    db.query(`select content from log where author='${writer}';`, function(error, res){
      html2+=`</p>`;
      var html=template.HTML("log","방명록",`
      ${html2}
      <form action="/revise_process" method="post">
        <div style="margin-left: 20px; margin-bottom: -10px;">
          <input type="hidden" name="id" value="${writer}">
          작성자 <input type="text" name="name" value="${writer}"style="resize:none; margin-top: 10px; width:100px;" maxlength="10">
        </div>
        <br>
        <textarea name="log" style="resize: none; margin-left: 20px;" rows="4" cols="100">${res[0].content}</textarea>
        <input type="submit" value="올리기">
      </form>
      `, status(request, response));
      response.send(html);
    })
  });
})

app.post('/revise_process', function(request, response){
    var post=request.body;
    db.query(`update log set author=?, content=? where author=?`,[post.name, post.log, post.id], function(error, result){
      if(error) {
        throw error;
      }
      response.writeHead(302,{Location: `/log`});
      response.end();
    //  response.redirect(302,'/log');
  });
})

app.post('/delete_process', function(request, response){
  if(!authIsOwner(request, response)){
    response.redirect('/');
    return false;
  }
    var post=request.body;
    db.query(`delete from log where author=?`,[post.id], function(error, result){
      if(error) {
        throw error;
      }
      response.writeHead(302,{Location: `/log`});
      response.end();
      //response.redirect(302,'/log');
  });
})

app.post('/login_process', function(request, response){
  var post=request.body;
  var id=post.id;
  var pwd=post.pwd;
  if(id===authData.id&&pwd===authData.password){
    request.session.is_logined=true;
    request.session.nickname=authData.nickname;
    request.session.save(function(){
      response.redirect('/');
    });
  }else{
    response.send("Who?");
  }
})
app.listen(3000, function(){
  console.log('Example app listening on port 3000!!');
})

app.get('/logout', function(request, response){
  request.session.destroy(function(error){
    response.redirect('/');
  })
})
