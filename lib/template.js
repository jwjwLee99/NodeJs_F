// 모듈화 하기위해 다른 파일로 옮김


module.exports = { // 객체화 작업 refactoring
    HTML:function (title, list, body, control) { // file body 함수
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        <style>
          a{ text-decoration-line: none; }
        </style>
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    }, LIST:function (filelist) { // file list 함수
      var list = '<ul>'; // file 리스트 불러오기 HTML, CSS , JavaScript
      var i = 0;
      while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>` // 링크 걸기
        i = i + 1;
      }
      list = list+'</ul>';
    
      return list;
    }
    
}

