const express = require('express');
const app = express();
const mysql = require('mysql');

const errorhandler = require('errorhandler');
const session = require('express-session');

const fileUpload = require('express-fileupload');

require('date-utils');
const path = require('path');
const fs = require('fs')

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(fileUpload());

//静的ファイル置き場指定
app.use(express.static('public'));

app.use(session({
  secret: 'false',
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 30
  }
}));




//index.htmlを描画
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//cdcearch.htmlを描画
app.get('/cdsearch', function(request, response) {
  response.sendFile(__dirname + '/views/cdsearch.html');
});

//videosearch.htmlを描画
app.get('/videosearch', function(request, response){
  response.sendFile(__dirname + '/views/videosearch.html');
});

//contact.htmlを描画
app.get('/contact', function(request, response) {
  response.sendFile(__dirname + '/views/contact.html');
});

//single.htmlを描画
app.get('/single' , function(request, response) {
  response.sendFile(__dirname + '/views/single.html');
});

//about.htmlを描画
app.get('/about', function(request, response) {
  response.sendFile(__dirname + '/views/about.html');
});

//login.htmlを描画
app.get('/login', function(request, response){
  response.sendFile(__dirname + '/views/login.html');
});

//userinout.htmlを描画
app.get('/userinfo', function(request, response) {
  response.sendFile(__dirname + '/views/userinput.html');
});

//account_page.htmlを描画
app.get('/account', function(request, response) {
  response.sendFile(__dirname + '/views/account_page.html');
})



//接続先DB設定
const mysql_setting = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'masaru'
}

//DBへクエリ
app.get('/dbpall', function(request, response) {
  console.log("GET request index:" + request.query.result_show);

  //SQL文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "SUM(salesdetails.sales_num) AS saleCount," +
              "stocks.stock,artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "INNER JOIN " +
              "salesdetails " +
              "ON " +
              "products.product_id " +
              "= " +
              "salesdetails.product_id " +
              "GROUP BY " +
              "products.product_id " +
              "ORDER BY " +
              "saleCount " +
              "DESC " +
              "LIMIT " +
              "10" +
              ";";

              //console.log(sql);

  //コネクションの設定を反映
  const connection = mysql.createConnection(mysql_setting);

  //コネクション確立
  connection.connect();
  //クエリ処理及びエラー処理
  connection.query(sql, function(error, results, fields) {
  if (error) throw error

    //サーバーからの返答
    response.send(results);

    //コネクション解除
    connection.end();
  });
});



//DBから商品情報を取得
app.get('/dbp', function(request, response, next) {
  console.log("GET request single:" + request.query.result_show);
  var productId = request.query.result_show;

  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict," +
              "information " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "INNER JOIN " +
              "productsinfo " +
              "ON " +
              "products.product_id" +
              "= " +
              "productsinfo.product_id " +
              "WHERE " +
              "products.product_id " +
              "= " +
              "'" + productId + "'" +
              ";";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error
  
  var productInfoHtml = '<h1 class="mb-3">' + results[0].product_name + '</h1>' +
                        '<p></p>' +
                        '<p>' +
                        '<img src="product_image/' + results[0].product_pict + '.jpg" alt="" class="img-fluid">' +
                        '</p>' +
                        '<p>' + results[0].information + '</p>' +
                        '<p>' + results[0].information + '</p>' +
                        '<h2 class="mb-3 mt-5">price: ¥' + results[0].price + '</h2>' +
                        '<p></p>' +
                        '<p>' +
                        '<img src="" alt="" class="img-fluid">' +
                        '</p>' +
                        '<div class="tag-widget post-tag-container mb-5 mt-5">' +
                        '<div class="tagcloud">' +
                        '<a href="/cartin?productid=' + results[0].product_id + '" style="margin: 0px 0px 0px 200px;" class="tag-cloud-link">inset cart</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="pt-5 mt-5">';
  
  
  
  var comenntInputHtml =  '<!-- END comment-list -->' +
                          '<div class="comment-form-wrap pt-5">' +
                          '<h3 class="mb-5">Leave a comment</h3>' +
                          '<form action="/revinput" method="get" class="p-3 p-md-5 bg-light">' +
                          '<div class="form-group">' +
                          '<label for="name">Title *</label>' +
                          '<input name="title" type="text" class="form-control" id="name">' +
                          '</div>' +
                          '<div class="form-group">' +
                          '<label for="message">Comment</label>' +
                          '<textarea name="comment" id="message" cols="30" rows="10" class="form-control"></textarea>' +
                          '<input type="hidden" name="productid" value="' + results[0].product_id + '">' +
                          '</div>' +
                          '<div class="form-group">' +
                          '<input type="submit" value="Post Comment" class="btn py-3 px-4 btn-primary">' +
                          '</div>' +
                          '</form>' +
                          '</div>' +
                          '</div>';

  request.productinfohtml = productInfoHtml;
  request.commentinputhtml = comenntInputHtml;
  next();
  connection.end();
  });
});


//DBからレビューを取得
app.get('/dbp', function(request, response) {
  console.log('single process!!');
  var productId = request.query.result_show;
  var productInfoHtml = request.productinfohtml; 
  var commentInputHtml = request.commentinputhtml;
  
  var sql = "SELECT " +
            "reviews.review_no," +
            "reviews.product_id," +
            "reviews.member_id," +
            "reviews.review_title," +
            "reviews.review," + 
            "reviews.evaluation," +
            "reviews.post_date," +
            "members.membar_name," +
            "members.member_pict " +
            "FROM " +
            "reviews " +
            "INNER JOIN " +
            "members " +
            "ON " +
            "reviews.member_id " +
            "= " +
            "members.member_id " +
            "WHERE " +
            "reviews.product_id " +
            "= " +
            "'" + productId + "';";

            console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query(sql, function(error, result, fields) {
    if (error) throw error

    var commentExists = result.length;

    if (commentExists) {
      console.log('comment find!!');

      var commentHtml = '<h3 class="mb-5 font-weight-bold">' + commentExists + ' Comments</h3>';

      for (var i = 0; i < commentExists; i++) {
        commentHtml = commentHtml + '<ul class="comment-list">' +
                                    '<li class="comment">' +
                                    '<div class="vcard bio">' +
                                    '<img src="' + result[0].member_pict + '" alt="Image placeholder">' +
                                    '</div>' +
                                    '<div class="comment-body">' +
                                    '<h3>' + result[i].membar_name + '</h3>' +
                                    '<div class="meta">' + result[i].post_date + '</div>' +
                                    '<p>' + result[i].review + '</p>' +
                                    '<p><a href="#" class="reply">report</a></p>' +
                                    '</div>' +
                                    '</li>' +
                                    '</ul>';

      }

      var lastHtml = productInfoHtml + commentHtml + commentInputHtml;

      response.send(lastHtml);
      connection.end();
    } else {
      console.log('comment not find!!');

      var commentHtml = '';
      var lastHtml = productInfoHtml + commentHtml + commentInputHtml;
      response.send(lastHtml);
      connection.end();
    }

  });
  
});


//レビュー登録(すでに投稿しているか？)
app.get('/revinput', function(request, response, next) {
  var session = request.session;
  
  
  if (session.login) {
    console.log('session find');

    var userId = session.login;
    var title = request.query.title;
    var comment = request.query.comment;
    var productId = request.query.productid;

    console.log('title:' + title);
    console.log('comment:' + comment);
    console.log('userID:' + userId);
    console.log('productID:' + productId);

    sql = "SELECT " +
          "* " +
          "FROM " +
          "reviews " +
          "WHERE " +
          "product_id " +
          "= " +
          "'" + productId + "' " +
          "&& " +
          "member_id " +
          "= " +
          "'" + userId + "';"

          console.log('sql:' + sql);

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();

    connection.query(sql, function(error, result, fields) {
      var commentExists = result.length;

      if (commentExists) {
        console.log('すでにこめんとしてる');
        response.redirect('/single?productid=' + productId);
      } else {
        console.log('投稿ok!!');
        next();
      }

    });


  } else {
    console.log('session not find');
    response.redirect('/login')
  }
});


//レビュー登録
app.get('/revinput', function(request, response) {
  var session = request.session;

  var userId = session.login;
  var title = request.query.title;
  var comment = request.query.comment;
  var productId = request.query.productid;

  sql = "INSERT INTO " +
        "reviews" +
        "(" +
        "product_id," +
        "member_id," +
        "review_title," +
        "review," +
        "evaluation," +
        "post_date" +
        ")" +
        "VALUES" +
        "(" +
        "'" + productId + "'," +
        "'" + userId + "'," +
        "'" + title + "'," +
        "'" + comment + "'," +
        0 + "," +
        "NOW()" +
        ");";


  //console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, result, fields) {
    if (error) throw error

  
    response.redirect('/single?productid=' + productId);
    connection.end();

  });
});



//全商品検索
app.get('/dbpsearch', function(request, response){
  console.log("GET request single:" + request.query.result_show);
  var productName = request.query.result_show;

  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "WHERE " +
              "(products.product_name " +
              "LIKE " +
              "'%" + productName + "%'" +
              "OR " +
              "products.artist_name " +
              "LIKE " +
              "'%" + productName + "%')" +
              ";";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

  response.send(results);
  connection.end();
  });
});



app.get('/cdall', function(request, response) {
  console.log("GET request CDAll:" + request.query.result_show);
  var result = request.query.result_show;


  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "WHERE " +
              "products.product_id " +
              "LIKE " +
              "'CD%'" +
              ";";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

  response.send(results);
  connection.end();
  });
});


app.get('/cdsearc', function(request, response) {

  console.log("GET request CDsearch:" + request.query.result_show);
  var result = request.query.result_show;


  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "WHERE " +
              "(products.product_id " +
              "LIKE " +
              "'CD%' " +
              "AND " +
              "products.product_name " +
              "LIKE " +
              "'%" + result + "%'" +
              ");";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

  response.send(results);
  connection.end();
  });
});



app.get('/videoall', function(request, response) {
  console.log("GET request videoAll:" + request.query.result_show);
  var result = request.query.result_show;


  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "WHERE " +
              "(products.product_id " +
              "LIKE " +
              "'DV%' " +
              "OR " +
              "products.product_id " +
              "LIKE " +
              "'BD%'" +
              ");";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

  response.send(results);
  connection.end();
  });
});



app.get('/viserch', function(request, response) {
  console.log("GET request videoSearch:" + request.query.result_show);
  var result = request.query.result_show;


  //sql文
  const sql = "SELECT " +
              "products.product_id," +
              "product_name," +
              "prices.price," +
              "stocks.stock," +
              "artist_name," +
              "label_price," +
              "product_code," +
              "release_date," +
              "product_genre," +
              "product_pict " +
              "FROM " +
              "products " +
              "INNER JOIN " +
              "prices " +
              "ON " +
              "products.product_id " +
              "= " +
              "prices.product_id " +
              "INNER JOIN " +
              "stocks " +
              "ON " +
              "products.product_id " +
              "= " +
              "stocks.product_id " +
              "WHERE " +
              "(products.product_id " +
              "LIKE " +
              "'DV%' " +
              "AND " +
              "products.product_name " +
              "LIKE " +
              "'%" + result + "%'" +
              ");";

              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

  response.send(results);
  connection.end();
  });
});


app.get('/locheck', function(request, response) {
  var userId = request.query.user_id;
  var userPasswd = request.query.user_passwd;



  //sql文
  const sql = "SELECT " +
              "member_id," +
              "member_pass," +
              "membar_name," +
              "membar_address," +
              "member_phone," +
              "membar_payment," +
              "membar_report," +
              "membar_status," +
              "member_pict " +
              "FROM " +
              "members " +
              "WHERE " +
              "member_id " +
              "= " +
              "'" + userId + "'";


              //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query(sql, function(error, results, fields) {
    if (error) throw error

    var userIdExists = results.length;
    if (userIdExists) {



    var hashPass = results[0].member_pass;



  bcrypt.compare(userPasswd, hashPass, function(err, result) {
    if (result) {
    console.log('password OK!!');
    var session = request.session;
    session.login = userId;
    response.send('PASSOK!!');
  } else {
    response.send('PASSNO!!');
  }

});

} else {
  response.send('PASSNO!!');
}

  connection.end();
  });



});


//新規会員登録
app.get('/accheck', function(request, response) {
  var name = request.query.name_result;
  var email = request.query.email_reslt;
  var phone = request.query.phone_result;
  var city = request.query.city_result;
  var address = request.query.addrss_result;
  var passwd = request.query.passwd_result;


  bcrypt.hash(passwd, saltRounds, function(err, hash) {

    //sql文
    const sql = "INSERT INTO " +
                "members" +
                "(" +
                "member_id," +
                "member_pass," +
                "membar_name," +
                "membar_address," +
                "member_phone," +
                "membar_payment," +
                "membar_report," +
                "membar_status," +
                "member_pict" +
                ")" +
                "VALUES" +
                "(" +
                "'" + email + "'," +
                "'" + hash + "'," +
                "'" + name + "'," +
                "'" + city + address + "'," +
                "'" + phone + "'," +
                "'1'," +
                "" + 0 + "," +
                "'0'," +
                "'-'" +
                ");";

                //console.log('sql:' + sql);

      const connection = mysql.createConnection(mysql_setting);

      connection.connect();

      connection.query(sql, function(error, results, fields) {
          if (error) throw error

      response.send('registok!!');
      connection.end();
          });

  });

});


//現在ログインしているかを確認する
app.get('/lonow', function(request, response) {

  var session = request.session;
  //セッションが存するか確認
  if (!!session.login) {
    console.log('session find!!');

    var userId = session.login;

    const sql = "SELECT " +
                "member_id," +
                "member_pass," +
                "membar_name," +
                "membar_address," +
                "member_phone," +
                "membar_payment," +
                "membar_report," +
                "membar_status," +
                "member_pict " +
                "FROM " +
                "members " +
                "WHERE " +
                "member_id " +
                "= " +
                "'" + userId + "'" +
                ";";


                //console.log('sql:' + sql);


    const connection = mysql.createConnection(mysql_setting);

    connection.connect();

    connection.query(sql, function(error, results, fields) {
      if (error) throw error

    response.send(results);
    connection.end();
    });



  } else {
    console.log('session not find!!');
    response.send('NO');
  }

});


//ログアウト実装
app.get('/logout', function(request, response) {
  console.log('logout!!');
  request.session.destroy(function(error) {
    response.redirect('/');
  });
});


//カート確認
app.get('/cartin', function(request, response, next) {
  console.log('cartProcess１');
  var session = request.session;

  var userId = session.login;
  var productId = request.query.productid;

  if (!!session.login) {

    //sql文
    const sql = "SELECT " +
                "member_id," +
                "cart_no," +
                "product_id," +
                "product_num " +
                "FROM " +
                "cart " +
                "WHERE " +
                "product_id " +
                "= " +
                "'" + productId + "' " +
                "&& " +
                "member_id " +
                "= " +
                "'" + userId + "'" +
                ";";

                //console.log('sql:' + sql);


    const connection = mysql.createConnection(mysql_setting);

    connection.connect();

    connection.query(sql, function(error, results, fields) {
      if (error) throw error

    var cartExists = results.length;
    if (cartExists) {
      console.log('入ってる');
      response.redirect('/')
    } else {
      console.log('入ってない');
      next();
    }

    connection.end();
    });



} else {
    //ログインしてなければログイン画面へ
    response.redirect('/login');
}
});





app.get('/cartin', function(request, response, next) {
  console.log('cartProcess２');

   var session = request.session;

    var userId = session.login;
    var productId = request.query.productid;



    //カートの番号確認
    const getCartNosql = "SELECT " +
                "member_id," +
                "cart_no," +
                "product_id," +
                "product_num " +
                "FROM " +
                "cart " +
                "WHERE " +
                "member_id " +
                "= " +
                "'" + userId + "'" +
                "ORDER BY " +
                "cart_no " +
                "DESC;"


                //console.log('sql:' + getCartNosql);


    const connection = mysql.createConnection(mysql_setting);

    connection.connect();

    connection.query(getCartNosql, function(error, results, fields) {
      if (error) throw error

    var cartNoExists = results.length;
    console.log('Cart OK?' + cartNoExists);
    if (cartNoExists) {
      console.log('cart in find!!');

      var cartNumber = results[0].cart_no;
      cartNumber++;
      request.cartNo = cartNumber;

      next();
    } else {
      console.log('cart in not find');
      var cartNumber = 1;
      request.cartNo = cartNumber;
      next();
    }

    connection.end();

    });
});


app.get('/cartin', function(request, response) {
  console.log('cartProcess３');
  var session = request.session;

  var productId = request.query.productid;
  var userId = session.login;
  var cartNo = request.cartNo;
  console.log('cart num received:' + cartNo);


  //sql文
  const sql = "INSERT INTO " +
              "cart" +
              "(" +
              "member_id," +
              "cart_no," +
              "product_id," +
              "product_num" +
              ")" +
              "VALUES" +
              "(" +
              "'" + userId + "'," +
              "" + cartNo + "," +
              "'" + productId + "'," +
              "1" +
              ");";

              console.log('sql:' + sql);

    const connection = mysql.createConnection(mysql_setting);

    connection.connect();

    connection.query(sql, function(error, results, fields) {
        if (error) throw error

    response.redirect('/');
    connection.end();
        });
});

//カート情報取得
app.get('/cartsh', function(request, response) {
  var session = request.session;

  var userId = session.login;

  if (session.login) {
    console.log('session find!!');

    const sql = "SELECT " +
                "member_id," +
                "cart_no," +
                "cart.product_id," +
                "product_num," +
                "product_name," +
                "product_pict," +
                "price," +
                "stock " +
                "FROM " +
                "cart " +
                "INNER JOIN " +
                "products " +
                "ON " +
                "cart.product_id " +
                "= " +
                "products.product_id " +
                "INNER JOIN " +
                "prices " +
                "ON " +
                "cart.product_id " +
                "= " +
                "prices.product_id " +
                "INNER JOIN " +
                "stocks " +
                "ON " +
                "cart.product_id " +
                "= " +
                "stocks.product_id " +
                "WHERE " +
                "cart.member_id " +
                "= " +
                "'" + userId + "'" +
                ";";

    //console.log('sql:' + sql);


    const connection = mysql.createConnection(mysql_setting);

    connection.connect();

    connection.query(sql, function(error, results, fields) {
          if (error) throw error

    var cartExists = results.length;
    if (cartExists) {
    response.send(results);
  } else {
    console.log('cart in not find');
    response.send('NO');
  }
    connection.end();
        });

  } else {
    console.log('session not find');
    response.send('NO');
  }

});


//カート内の注文個数変更処理
app.get('/cartnumch',function(request, response, next) {
  console.log('cart change!!');
  var deleteOk = false;
  var sql ="";
  var session = request.session;
  var userId = session.login;

  var upChange = request.query.up;
  var downChange = request.query.down;
  var productId = request.query.productid;
  var cartNum = request.query.cartnum;


  //プラスボタンが押された時
  if (upChange == '＋') {
  console.log('UP!!!!!!:' + upChange);
    cartNum++;
}

  //マイナスボタンが押された時
  if (downChange == 'ー') {
  console.log('down!!!!:' + downChange);
  cartNum--;
  if (cartNum == 0) {
    deleteOk = true;
  next();
  }
}


//SQL
sql = "UPDATE " +
      "cart " +
      "SET " +
      "product_num " +
      "= " +
      cartNum + " " +
      "WHERE " +
      "member_id " +
      "= " +
      "'" + userId + "' " +
      "&& " +
      "product_id " +
      "= " +
      "'" + productId + "'" +
      ";";

  //console.log('sql:' + sql);

//クエリ
if (!deleteOk) {
  console.log('SQL do!!');
  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {

    connection.end();

    response.redirect('/');
  });


}


});

//カートの購入個数が0になった場合の削除処理
app.get('/cartnumch', function(request, response) {
  console.log('DELETE middleware!!');

  var session = request.session;
  var userId = session.login;
  var productId = request.query.productid;

  var sql = "DELETE " +
            "FROM " +
            "cart " +
            "WHERE " +
            "member_id " +
            "= " +
            "'" + userId + "' " +
            "&& " +
            "product_id " +
            "= " +
            "'" + productId + "'" +
            ";";

  //console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {

    connection.end();

    response.redirect('/');
  });

});


//デリートボタン
app.get('/delete', function(request, response) {
  console.log('DELETE BUTTON!!');
  var session = request.session;
  var userId = session.login;
  var productId = request.query.productid;



  var sql = "DELETE " +
            "FROM " +
            "cart " +
            "WHERE " +
            "member_id " +
            "= " +
            "'" + userId + "' " +
            "&& " +
            "product_id " +
            "= " +
            "'" + productId + "'" +
            ";";

  //console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {

    connection.end();

    response.redirect('/');
  });

});







//決済ボタンがおされたら
app.get('/payment', function(request, response, next) {
  console.log('payment!!');

  var session = request.session;
  var userId = session.login;

  sql = "SELECT " +
        "member_id," +
        "cart_no," +
        "cart.product_id," +
        "product_num," +
        "product_name," +
        "product_pict," +
        "price," +
        "stock " +
        "FROM " +
        "cart " +
        "INNER JOIN " +
        "products " +
        "ON " +
        "cart.product_id " +
        "= " +
        "products.product_id " +
        "INNER JOIN " +
        "prices " +
        "ON " +
        "cart.product_id " +
        "= " +
        "prices.product_id " +
        "INNER JOIN " +
        "stocks " +
        "ON " +
        "cart.product_id " +
        "= " +
        "stocks.product_id " +
        "WHERE " +
        "cart.member_id " +
        "= " +
        "'" + userId + "'" +
        ";";

  //console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {
    request.cartresult = results;
    connection.end();
    next();

  });
});

//在庫確認分岐処理
app.get('/payment', function(request, response, next) {

  var productResults = request.cartresult;
  var stockCheck = true;

  for (var i = 0; i < productResults.length; i++) {
    var stock = productResults[i].stock;
    var salesNum = productResults[i].product_num;

    if(stock < salesNum) {
      stocCheck = false;
    }
  }

  if (stockCheck) {
    console.log('stock cut back!!');

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();

    for (var i = 0; i < productResults.length; i++) {
      var productId = productResults[i].product_id;
      var stock = productResults[i].stock;
      var salesNum = productResults[i].product_num;
      var insertStock = stock - salesNum;

      sql = "UPDATE " +
            "stocks " +
            "SET " +
            "stock " +
            "= " +
            insertStock + " " +
            "WHERE " +
            "product_id " +
            "= " +
            "'" + productId + "'" +
            ";"

      //console.log('sql:' + sql);

      connection.query(sql, function(error, results, fields) {
        console.log('stock change!!');
        next();
      });

    }

  } else {
    console.log('inventory shortage!!');
    response.redirect('/');
  }

})



//salesテーブルに会員ID等を記録
app.get('/payment', function(request, response, next) {

  var session = request.session;
  var userId = session.login;

  var sql = "INSERT " +
            "INTO " +
            "sales" +
            "(" +
            "member_id," +
            "seles_datetime," +
            "delivery_no," +
            "sales_type" +
            ")" +
            "VALUES" +
            "(" +
            "'" + userId + "'," +
            "NOW()," +
            0 + "," +
            "'-'" +
            ");";

    //console.log('sql:' + sql);

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query(sql, function(error, results, fields) {
      console.log('sales insert OK!!');
      connection.end();
      next();
    });
});






//salesテーブルの主キーの最後の数値を取得
app.get('/payment', function(request, response, next) {
  var sql = "SELECT "  +
            "sales_id " +
            "FROM " +
            "sales " +
            "ORDER BY " +
            "sales_id " +
            "DESC " +
            "LIMIT 1;"

  //console.log('sql:' + sql);


  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {


    console.log('last sales_id:' + results[0].sales_id);
    var lastSalesId = results[0].sales_id;
    request.lastsalesid = lastSalesId;
    connection.end();
    next();

  });
});






//salesdateilsにデータを入れる
app.get('/payment', function(request, response, next) {

  var session = request.session;
  var userId = session.login;
  var lastSalesId = request.lastsalesid;
  var productResults = request.cartresult;


  const connection = mysql.createConnection(mysql_setting);
  connection.connect();

  for (var i = 0; i < productResults.length; i++) {

    var productId = productResults[i].product_id;
    var salesPrice = productResults[i].price;
    var salesNum = productResults[i].product_num;

    var sql = "INSERT INTO " +
              "salesdetails" +
              "(" +
              "sales_id," +
              "salesdetails_no," +
              "product_id," +
              "sale_price," +
              "sales_num" +
              ")" +
              "VALUES" +
              "(" +
              lastSalesId + "," +
              (i + 1) + "," +
              "'" + productId + "'," +
              salesPrice + "," +
              salesNum +
              ");";

    //console.log('sql:' + sql);

    connection.query(sql, function(error, results, fields) {

      console.log('salesdetails insert OK!!');
    });
  }
  connection.end();
  next();
});


//カート情報削除
app.get('/payment', function(request, response) {
  console.log('LAST DELETE!!')

  var session = request.session;
  var userId = session.login;

  console.log('userId:' + userId);

  var sql = "DELETE FROM " +
            "cart " +
            "WHERE " +
            "member_id " +
            "= " +
            "'" + userId + "'" +
            ";";

  console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, results, fields) {
    console.log('cart in delete!!');
    response.send('payment OK!!');
    connection.end();
  });
});


//購入履歴取得
app.get('/history', function(request, response) {
  var value = request.query.result_show;
  console.log('request GET:' + value);
  var session = request.session;
  var userId = session.login;


  var sql = "SELECT " +
            "sales.sales_id," +
            "sales.member_id," +
            "sales.seles_datetime," +
            "sales.delivery_no," +
            "sales.sales_type," +
            "salesdetails.product_id," +
            "salesdetails.sale_price," +
            "salesdetails.sales_num," +
            "products.product_name," +
            "products.product_pict " +
            "FROM " +
            "sales " +
            "INNER JOIN " +
            "salesdetails " +
            "ON " +
            "sales.sales_id " +
            "= " +
            "salesdetails.sales_id " +
            "INNER JOIN " +
            "products " +
            "ON " +
            "salesdetails.product_id " +
            "= " +
            "products.product_id " +
            "WHERE " +
            "sales.member_id " +
            "= " +
            "'" + userId + "' " +
            "ORDER BY " +
            "sales.sales_id " +
            "DESC" +
            ";";

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query(sql, function(error, results, fields) {
      if (error) throw error

    response.send(results);

    });
});


//会員情報変更画面描画
app.get('/uinfoch', function(request, response) {
  console.log('request GET user information Change:' + request.query.resalt_show);
  var session = request.session;
  var userId = session.login;

  if (userId) {
    console.log('Login OK!!');
    response.send('LoginOk!!');
  } else {
    console.log('Login NO!');
    response.send('LoginNo!');
  }

});


//会員情報変更処理
app.get('/acch', function(request, response) {
  console.log('request GET param usereInformation');

  var nameCheck = false;
  var phoneCheck = false;
  var addressCheck = false;

  var session = request.session;
  var userId = session.login;

  var name = request.query.name;
  var phone = request.query.phone
  var city = request.query.city;
  var address = request.query.address;

  if (userId) {
    console.log('session findd!!');

    if (name) {
      console.log('name find!!');
      nameCheck = true;
    }

    if (phone) {
      console.log('phone find!!');
      phoneCheck = true;
    }

    if (city && address) {
      console.log('city find!!');
      addressCheck = true;
    }

    if (nameCheck || phoneCheck || addressCheck) {
      console.log('sql do it!!');

      if (name || phone || city || address) {


      //sql文
      var sql = "UPDATE " +
                "members " +
                "SET ";

                if (name) {
                  sql = sql + "membar_name " +
                        "= " +
                        "'" + name + "' ";
                }

                if (phone) {
                  sql = sql + "member_phone " +
                              "= " +
                              "'" + phone + "'";
                }

                if (city && address) {
                  sql = sql + "membar_address " +
                              "= " +
                              "'" + city + address + "'";
                }

        sql = sql + "WHERE " +
                    "member_id " +
                    "= " +
                    "'" + userId + "';";


                  console.log('sql:' + sql);

        const connection = mysql.createConnection(mysql_setting);

        connection.connect();

        connection.query(sql, function(error, results, fields) {
            if (error) throw error

        console.log('sql query ok!!');
        response.redirect('/account');
        connection.end();
            });

          } else {
            response.redirect('/')
          }
    }
  }
});


//パスワード変更画面描画
app.get('/passch', function(request, response) {
  var session = request.session;
  var userId = session.login;

  if (userId) {
    response.send('passOK!!');

  } else {
    response.send('passNo!!');
  }

});


//パスワード変更処理
app.get('/passac', function(request, response) {
  console.log('request GET pass regist!!')
  var pass1 = request.query.password1;
  var pass2 = request.query.password2;

  var session = request.session;
  var userId = session.login;

  if (pass1 == pass2) {
    var passwd = pass1;

    bcrypt.hash(passwd, saltRounds, function(err, hash) {

      //sql文
      const sql = "UPDATE " +
                  "members " +
                  "SET " +
                  "member_pass " +
                  "= " +
                  "'" + hash + "' " +
                  "WHERE " +
                  "member_id " +
                  "= " +
                  "'" + userId + "'"
                  ");";
  
                  console.log('sql:' + sql);
  
        const connection = mysql.createConnection(mysql_setting);
  
        connection.connect();
  
        connection.query(sql, function(error, results, fields) {
            if (error) throw error
  
        response.redirect('/account');
        connection.end();
            });
    });
  }
});


//アカウントイメージ変更
app.post('/imgch', function(request, response, next) {

  var session = request.session;
  var userId = session.login;

  sql = "SELECT " +
        "member_id," +
        "member_pass," +
        "membar_name," +
        "membar_address," +
        "member_phone," +
        "membar_payment," +
        "membar_report," +
        "membar_status," +
        "member_pict " +
        "FROM " +
        "members " +
        "WHERE " +
        "member_id " +
        "= " +
        "'" + userId + "';"

        //console.log('sql:' + sql);

  const connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, function(error, result, fields) {

    var pictPathExists = result.length;
    if (pictPathExists) {
      console.log('DB image path delete');

      var imagePath = result[0].member_pict;
      console.log('pictPath:' + imagePath);

      //サーバーに保存されている画像を削除
      fs.unlink('public/' + imagePath, function(err) {

      });

    }

    connection.end();
    next();
  });
});


app.post('/imgch', function(request, response) {

  var now = new Date();
  var time = now.toFormat('YYYYMMDDHH24MISS');

  var session = request.session;
  var userId = session.login;

  console.log('日付:' + time);

  var iconExt = path.extname(request.files.pic.name);
  var newIconName = time + request.files.pic.md5 + iconExt;

  var targetPathImage = 'public/images/' + newIconName;

  //指定したフォルダへ画像を保存
  fs.writeFile(targetPathImage, request.files.pic.data, function(err) {

    if (err) {
      throw err
    } else {
      //ファイル名をDBへ登録

      sql = "UPDATE " +
            "members " +
            "SET " +
            "member_pict " +
            "= " +
            "'images/" + newIconName + "' " +
            "WHERE " +
            "member_id " +
            "= " +
            "'" + userId + "';";

            console.log('sql:' + sql);

      const connection = mysql.createConnection(mysql_setting);
      connection.connect();
      connection.query(sql, function(error, result, fields) {

        response.redirect('/account');
        connection.end();
      });


    }
  });
})



//存在しないファイルパスへアクセスされたら
app.use(function(request, response, next) {
  var error = new Error('cannot ', request.method + ' ' + request.path);
  error.status = 404;
  next(error);

});

app.use(errorhandler());

//ポート番号8080でサーバー立てる
var server = app.listen(8080, function() {

    console.log('Example app listening on :' + server.address().port);

});
