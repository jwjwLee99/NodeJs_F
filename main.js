var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // querystring 포함시 get방식
var path = require('path'); // 입력 정보 보안
var sanitizeHtml = require('sanitize-html'); //  출력 정보 보안
var template = require('./lib/template.js')// 모듈로 불러오기

var app = http.createServer(function(request,response){ //웹페이지 서버
    var _url = request.url;
    var myURL = new URL('http://localhost:3000' + _url); // ?id={}
    var queryData = myURL.searchParams.get('id'); //querystring id data diractory
    var pathName = url.parse(_url, true).pathName; // URL경로와 그 앞의 '/'로 이루어진 경로는 불러오기
    if(queryData){
    }else{
      queryData = undefined;
    }
    
    if(pathName === '/'){ // root = '/' HOME
      if(queryData === undefined){ // WEB HOME 화면 query data = undefined
        fs.readdir('./data/', function(err, filelist){ // readdir 파일 목록 알아내기
          var title = 'Welcome';
          var description = 'Hello, Node.js';
        
          // var list = templateList(filelist); // 함수 선언

          // var template = templateHTML(title, list, 
          //   `<h2>${title}</h2>${description}`,
          //   `<a href="/create">Create</a>`); // 함수 선언 create
          // //`<h2>${title}</h2>${description}`=${body}
          
          // response.writeHead(200);
          // response.end(template);

          var list = template.LIST(filelist); // 함수 선언 ^*객체화*^
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">Create</a>`); // 함수 선언 create
          //`<h2>${title}</h2>${description}`=${body}
          
          response.writeHead(200);
          response.end(html);
        });
      } else{ // HTML, CSS, JavaScript 페이지 querydata = defined
        fs.readdir('./data/', function(err, filelist){ // readdir 파일 목록 알아내기
          var filteredID = path.parse(queryData).base; // queryData filter 처리 보안 (입력)
          fs.readFile(`data/${filteredID}`, 'utf8', function(err, description){
            var title = queryData; //
            var sanitizedTitle = sanitizeHtml(title); // sanitize 보안 (출력)
            var sanitizedDescription = sanitizeHtml(description); // sanitize 보안 (출력)
            var list = template.LIST(filelist);
            var html = template.HTML(title, list, 
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">Create</a> 
                <a href="/update?id=${sanitizedTitle}">Update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="Delete">
                </form>`  
            ); // create(), update(), delete()
            //`<h2>${title}</h2>${description}`=${body}

            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }else if(pathName === '/create'){ // create()
      if(queryData === undefined){ // WEB HOME 화면 query data = undefined
        fs.readdir('./data/', function(err, filelist){ // readdir 파일 목록 알아내기
          var title = 'WEB - create';

          var list = template.LIST(filelist); // 함수 선언

          var html = template.HTML(title, list,
            `
              <form action="/create_process" method="POST"> 
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
          `, ''); // 함수 선언 // form.html
          
          response.writeHead(200);
          response.end(html);
        });
      }
    }else if(pathName === '/create_process') { // create() post 방식으로 전송된 데이터 받기
      var body = '';
      request.on('data', function(data){ // data 받기
        body = body + data;
      });
      request.on('end', function(){ //data가 다 들어오면 callback 함수 실행
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){ // data 폴더에 저장 (fs.writeFile)
          response.writeHead(302, {location: `/?id=${title}`});// Rediraction
          response.end('Success');
          console.log(post);
        });
      });
    }else if(pathName === '/update'){ // update()
      fs.readdir('./data/', function(err, filelist){ // readdir 파일 목록 알아내기
        var filterdID = path.parse(queryData).base; // queryData filter처리 보안 (입력)
        fs.readFile(`data/${filterdID}`, 'utf8', function(err, description){
          var title = queryData; //
          var list = template.LIST(filelist);
          var html = template.HTML(title, list, 
            `
              <form action="/update_process" method="POST"> 
                <input type="hidden" name="id", value="${title}">
                <p><input type="text" name="title" placeholder="title" value= "${title}" ></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `,
            `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`); // create(), update()
          //`<h2>${title}</h2>${description}`=${body}

          response.writeHead(200);
          response.end(html);
        });
      });
    }else if(pathName === '/update_process'){ // update() post 방식으로 전송된 데이터 받기
      var body = '';
      request.on('data', function(data){ // data 받기
        body = body + data; // 들어온 데이터 body에 저장
      });
      request.on('end', function(){ //data가 다들어오면 callback함수 실행
        var post = qs.parse(body);
        var id = post.id; // 변경될 id값
        var filterdID = path.parse(id).base; // id 값 filter 보안 (입력)
        var title = post.title; //수정된 title값
        var description = post.description; //수정된 description 값
        fs.rename(`data/${filterdID}`, `data/${title}`, function(err){ // 파일 이름과 내용 바꾸기
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){ // data 폴더에 저장 (fs.writeFile)
            response.writeHead(302, {location: `/?id=${title}`});// Rediraction
            response.end('Success');
          });
        });
        console.log(post);
      });
    }else if(pathName === '/delete_process'){ // delete() post 방식으로 전송된 데이터 받기
      var body = '';
      request.on('data', function(data){ // data 받기
        body = body + data;
      });
      request.on('end', function(){ //정보 수신 종료
        var post = qs.parse(body);
        var id = post.id; // id값
        var filterdID = path.parse(id).base; // id 값 filter 보안 (입력)
        fs.unlink(`data/${filterdID}`, function(err){
          response.writeHead(302, {location: `/`});// Rediraction
          response.end();
        });    
      });
    }else{ //data 폴더에 없는 데이터 호출 할때 Not found 출력
      response.writeHead(404); // error
      response.end('Not found!');
    }
});
app.listen(3000);

//정리
// 200 : 페이지 성공
// 404 : 에러
// 3000 : localhost
// 302 : 페이지 rediraction
// C: create R: read U: update D: delete
// API : Application Programming Interface
// Interface : 조작 장치

// var http = require('http'); : 인수에 가져올 개체 이름을 지정하여 해당 개체가 로드되어 반환
// http.createServer() : http 오브젝트의 "createServer"메서드를 호출, Node.js의 "서버"
// request : http.Server 객체가 클라이언트의 요청을 받았을 때 발생하는 이벤트
// writeHead : response 객체의 메소드에서 헤더의 정보를 응답에 작성해서 내보낸느것
// fs.readFile( 파일의 경로, 인코딩, 콜백 함수) : 읽기 후의 처리, 작업이 끝나면 나중에 호출되는 함수 - callback
// fs.rename(oldPath, newPath, callback) :  파일명 변경
// fs.writeFile(fileName, data, [options], callback) : 파일 저장하기
/*form 정리 
- 삭제는 <a>태그 형태나 GET방식으로 만들면 안됨 -> 누군가 해당 링크로 접속해 삭제할 수 있음
fs.unlink(path, callback)
*/
/*
<form> 
action : submit 했을 때 이동할 주소
*/