


//購入履歴ボタン
$('#history').on('click', function() {
  console.log('history Button!!');


  $.ajax({
    url: "/history",
    type: "GET",
    data: {
      result_show: "OK!!"
    }
  }).done(function(result) {
    //json取得後に実行

    console.log("受け取ったJson配列数:" + result.length);


    var resultHtml = "";


    for (var i = 0; i < result.length; i++) {

      var buyDate = result[i].seles_datetime;
      var date = new Date(buyDate);

      var YYYY = date.getFullYear();
      var MM = date.getMonth() + 1;
      var DD = date.getDate();



      resultHtml = resultHtml +
      '<div class="col-md-12">' +
      '<div class="" style="margin: 10px;">' +
      '<a href="/single?productid=' + result[i].product_id + '" class="img img-2"><img class="img img-2" style="width: 200px; height: 200px;" src="product_image/' + result[i].product_pict + '.jpg" alt="TAG index"></a>' +
      '<div class="text text-2 pl-md-4">' +
      '<h3 class="mb-2"><a href="/single?productid=' + result[i].product_id + '">' + result[i].product_name + '</a></h3>' +
      '<div class="meta-wrap">' +
      '<p class="meta">' +
      '<span>' + YYYY + ' / ' + MM + ' / ' + DD + '</span>' +
      '<span><a href="/single?productid=' + result[i].product_id + '">詳細</a></span>' +
      '<span>5 Comment</span>' +
      '</p>' +
      '</div>' +
      '<p class="mb-4">price: ¥' + result[i].sale_price + '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

}

$('#show').html(resultHtml);

$('#history').addClass('colorlib-active');
$('#information').removeClass('colorlib-active');
$('#passwdch').removeClass('colorlib-active');


  }).fail(function(e) {
    //失敗時の処理
    console.log('error:' + e);
    alert("読み込み失敗！！");

  }).always(function(result) {
    //常に実行される
  });
});



//会員情報変更ボタン
$('#information').on('click', function() {
  console.log('info change button!!');

  $.ajax({
    url: '/uinfoch',
    type: 'GET',
    data:{
      resalt_show: 'OK!!'
    }
  }).done(function(result) {



    var html = '<div class="toaster"></div>' +
               '<main class="wrapper">' +
               '<section class="section-form">' +
               '<h1>information Change</h1>' +
               '<p>' +
               'Tell us your information<br>' +
               '</p>' +
               '<form method="GET" action="/acch" class="form" novalidate>' +
               '<div class="form-group">' +
               '<label for="name" class="form-label form-label--required">' +
               'Name:' +
               '</label>' +
               '<div class="form-addon" data-states-for="name">' +
               '<div class="form-addon__addon">' +
               '<span class="icon-name"></span>' +
               '</div>' +
               '<input type="text"' +
               'id="name"' +
               'name="name"' +
               'class="form-input"' +
               'placeholder="John Doe"' +
               'required>' +
               '<span class="form-addon__icon icon-valid"></span>' +
               '<span class="form-addon__icon icon-invalid"></span>' +
               '</div>' +
               '</div>' +
               '<div class="form-group">' +
               '<label for="phone" class="form-label form-label--required">' +
               'Phone number:' +
               '</label>' +
               '<div class="form-addon" data-states-for="phone">' +
               '<div class="form-addon__addon">' +
               '<span class="icon-phone"></span>' +
               '</div>' +
               '<input type="text"' +
               'id="phone"' +
               'name="phone"' +
               'class="form-input"' +
               'placeholder="123 456 789"' +
               'pattern="[0-9]{3} [0-9]{3} [0-9]{3}">' +
               '<span class="form-addon__icon icon-valid"></span>' +
               '<span class="form-addon__icon icon-invalid"></span>' +
               '</div>' +
               '</div>' +
               '<div class="form-group">' +
               '<label for="city" class="form-label form-label--required">' +
               ' City:' +
               '</label>' +
               '<div class="form-addon" data-states-for="name">' +
               ' <div class="form-addon__addon">' +
               '<span class="icon-name"></span>' +
               '</div>' +
               '<input type="text"' +
               'id="city"' +
               'name="city"' +
               'class="form-input"' +
               'placeholder="city"' +
               'required>' +
               '<span class="form-addon__icon icon-valid"></span>' +
               '<span class="form-addon__icon icon-invalid"></span>' +
               '</div>' +
               '</div>' +
               '<div class="form-group">' +
               '<label for="city" class="form-label form-label--required">' +
               'Address:' +
               '</label>' +
               '<div class="form-addon" data-states-for="name">' +
               '<div class="form-addon__addon">' +
               '<span class="icon-name"></span>' +
               '</div>' +
               '<input type="text"' +
               'id="address"' +
               'name="address"' +
               'class="form-input"' +
               'placeholder="address"' +
               'required>' +
               '<span class="form-addon__icon icon-valid"></span>' +
               '<span class="form-addon__icon icon-invalid"></span>' +
               '</div>' +
               '</div>' +
               '<div class="form-footer">' +
               '<button id="submit" type="submit" class="button">Change</button>' +
               '</div>' +
               '</form>' +
               '<form action="/imgch" method="post" enctype="multipart/form-data">' +
               'icon image change<input type="file" class="form-input" name="pic">' +
               '<br>' +
               '<input type="submit" name="botan" class="button" value="send">' +
               '</form>' +
               '</section>' +
               '</main>';


    $('#show').html(html);

    
    $('#information').addClass('colorlib-active');
    $('#history').removeClass('colorlib-active');
    $('#passwdch').removeClass('colorlib-active');
    



  }).fail(function(e) {
    alert('通信失敗!!');
  }).always(function(result) {
    //常に動く場所
  });

});


//パスワード変更画面
$('#passwdch').on('click', function() {
  console.log('password Change!!');

  $.ajax({
    url: '/passch',
    type: 'GET',
    data:{
      result_show: 'pssschange!!'
    }
  }).done(function(result) {
    console.log('response:' + result);

    if (result == 'passOK!!') {

      var html = '<main class="wrapper">' +
                 '<section class="section-form">' +
                 '<h1>Password Change</h1>' +
                 '<p>' +
                 'please password chaneg!!<br>' +
                 '</p>' +
                 '<form method="GET" action="/passac" class="form" novalidate>' +
                 '<div class="form-group">' +
                 '<label for="password" class="form-label form-label--required">' +
                 'Password <span class="text-muted">(minimum 8 characters)</span>:' +
                 '</label>' +
                 '<div class="form-addon" data-states-for="password">' +
                 '<div class="form-addon__addon">' +
                 '<span class="icon-password"></span>' +
                 '</div>' +
                 '<input type="password"' +
                 'id="password1"' +
                 'name="password1"' +
                 'class="form-input"' +
                 'placeholder="********"' +
                 'minlength="8"' +
                 'required>' +
                 '<span class="form-addon__icon icon-valid"></span>' +
                 '<span class="form-addon__icon icon-invalid"></span>' +
                 '</div>' +
                 '</div>' +
                 '<div class="form-group">' +
                 '<label for="password" class="form-label form-label--required">' +
                 'Password <span class="text-muted">(minimum 8 characters)</span>:' +
                 '</label>' +
                 '<div class="form-addon" data-states-for="password">' +
                 '<div class="form-addon__addon">' +
                 '<span class="icon-password"></span>' +
                 '</div>' +
                 '<input type="password"' +
                 'id="password2"' +
                 'name="password2"' +
                 'class="form-input"' +
                 'placeholder="********"' +
                 'minlength="8"' +
                 'required>' +
                 '<span class="form-addon__icon icon-valid"></span>' +
                 '<span class="form-addon__icon icon-invalid"></span>' +
                 '</div>' +
                 '</div>' +
                 '<div class="form-footer">' +
                 '<button id="submit" type="submit" class="button">Sign up</button>' +
                 '</div>' +
                 '</form>' +
                 '</section>' +
                 '</main>';


      $('#show').html(html);

      $('#passwdch').addClass('colorlib-active');
      $('#history').removeClass('colorlib-active');
      $('#information').removeClass('colorlib-active');

    } 

  }).fail(function(e) {


  }).always(function(result) {


  })
  

});




