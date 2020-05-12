module.exports={
  HTML:function(select, body, something, status){
    return  `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>My Diary</title>
            <style>
                #grid{
                  border:1px solid black;
                  display:grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  margin-right: 20px;
                }
                #wrap{
                  min-height:100%;
                  position:relative;
                  padding-bottom:19px;
                }
                *{
                  margin: auto;
                }
                body{
                  overflow: scroll;
                  height : auto;
                }
                header{
                  border-bottom: 2px solid black;
                  font-size: 30px;
                  text-align: center;
                  margin-botton:10px;
                }
                h3{
                  margin-top:-5px;
                  text-align:center;
                  border-bottom: 2px solid;
                  padding: 10px;
                }
                a{
                  text-decoration:none;
                  margin-right: 20px;
                }
                aside{
                  float:left;
                  width: 15%;
                  height: 100%;
                  text-align: center;
                  font-size: 20px;
                  border-right: 2px solid black;
                }
                section{
                  float:right;
                  width: 83%;
                  height: 500px;
                }
                footer{
                  float: right;
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  height: 19px;
                }
            </style>
        </head>
        <body>
            <header><a href="/">아무개의 Diary</a></header>
            <div id="wrap">
              <h3>
                  <a href="/log">log</a>
                  <a href="/diary">diary</a>
                  <a href="/picture">picture</a>
              </h3>
              <aside>
                ${status}
                ${select}<br>
              </aside>
              <section>
                <h2>${body}</h2>
                <article><p>${something}</p></article>
              </section>
              <footer>
                <a href="/">My Diary</a>
            </footer>
            </div>
        </body>
    </html>
    `;
  }

}
