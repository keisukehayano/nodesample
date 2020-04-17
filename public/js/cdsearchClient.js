
$(window).on('load', function() {
  getAllcd();
  loginSessionCheck();
  cartLoginOnly();
});


$('#search').keypress(function(e){
  if (e.which == 13) {
    var searchValue = $('#search').val();
    getCdsearch(searchValue);
    $('#search').val('');

  }


});


function getAllcd() {

  $.ajax({
    url: '/cdall',
    type: 'GET',
    data:{
      result_show: 'cdOK!!'
    }

  }).done(function(result) {

    console.log("受け取ったJson配列数:" + result.length);


    var resultHtml = "";


    for (var i = 0; i < result.length; i++) {

      resultHtml = resultHtml +
      '<div class="col-md-12">' +
      '<div class="" style="margin: 10px;">' +
      '<a href="/single?productid=' + result[i].product_id + '" class="img img-2"><img class="img img-2" style="width: 200px; height: 200px;" src="product_image/' + result[i].product_pict + '.jpg" alt="TAG index"></a>' +
      '<div class="text text-2 pl-md-4">' +
      '<h3 class="mb-2"><a href="/single?productid=' + result[i].product_id + '">' + result[i].product_name + '</a></h3>' +
      '<div class="meta-wrap">' +
      '<p class="meta">' +
      '<span>Dec 14, 2018</span>' +
      '<span><a href="/single?productid=' + result[i].product_id + '">Travel</a></span>' +
      '<span>5 Comment</span>' +
      '</p>' +
      '</div>' +
      '<p class="mb-4">price: ¥' + result[i].price + '</p>' +
      '<a href="/cartin?productid=' + result[i].product_id + '" + class="btn-custom">Insert Cart <span class="ion-ios-arrow-forward"></span></a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

}

$('#result_show').html(resultHtml);


  }).fail(function(e) {
    console.log('error:' + e);
    alert('読み込み失敗!!');

  }).always(function(result) {
    //常に実行される
  });


}


function getCdsearch(productName) {

  $.ajax({
    url: '/cdsearc',
    type: 'GET',
    data:{
      result_show: productName
    }

  }).done(function(result) {

    console.log("受け取ったJson配列数:" + result.length);


    var resultHtml = "";


    for (var i = 0; i < result.length; i++) {

      resultHtml = resultHtml +
      '<div class="col-md-12">' +
      '<div class="" style="margin: 10px;">' +
      '<a href="/single?productid=' + result[i].product_id + '" class="img img-2"><img class="img img-2" style="width: 200px; height: 200px;" src="product_image/' + result[i].product_pict + '.jpg" alt="TAG index"></a>' +
      '<div class="text text-2 pl-md-4">' +
      '<h3 class="mb-2"><a href="/single?productid=' + result[i].product_id + '">' + result[i].product_name + '</a></h3>' +
      '<div class="meta-wrap">' +
      '<p class="meta">' +
      '<span>Dec 14, 2018</span>' +
      '<span><a href="/single?productid=' + result[i].product_id + '">Travel</a></span>' +
      '<span>5 Comment</span>' +
      '</p>' +
      '</div>' +
      '<p class="mb-4">price: ¥' + result[i].price + '</p>' +
      '<p><a href="#" class="btn-custom">Read More <span class="ion-ios-arrow-forward"></span></a></p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

}

$('#result_show').html(resultHtml);


  }).fail(function(e) {
    console.log('error:' + e);
    alert('読み込み失敗!!');

  }).always(function(result) {
    //常に実行される
  });

}





//現在ログインしているかを確認
function loginSessionCheck() {

  $.ajax({
    url: '/lonow',
    type: 'GET',
    data:{
      result_show: 'loginnow?'
    }
  }).done(function(result) {
    if (result != 'NO') {

      var name = result[0].membar_name;
      var pictPath = result[0].member_pict;

      if (pictPath != '-') {
        $('#userimg').attr('src', pictPath);
        console.log('画像書き換え!!');
      }
      $('#logbutton').text('Logout')
      $('#logbutton').attr('href', '/logout');
      $('#accountname').text(name);
      $('#accountstatus').text('Hello!!');
      $('#accountimg').attr('href', '/account');

    }

  }).fail(function(e) {
    console.log('error:' + e);
    alert('通信失敗!!');
  }).always(function(result) {
      //常に動く場所
  });

}


//カートを表示するかどうか
function cartLoginOnly() {

  $.ajax({
    url: '/cartsh',
    type: 'GET',
    data:{
      result_show: 'cartShow!!'
    }
  }).done(function(result) {

    if (result != 'NO') {
      console.log('カート表示');

      var html = '';
      var count = 1;
      var sumPrice = 0;
      for (var i = 0; i < result.length; i++) {
        console.log('会員番号:' + result[i].member_id);
        console.log('カート項番:' + result[i].cart_no);
        console.log('商品ID:' + result[i].product_id);
        console.log('個数:' + result[i].product_num);
        console.log('商品名:' + result[i].product_name);
        console.log('商品画像:' + result[i].product_pict);
        console.log('商品価格:' + result[i].price);
        console.log('在庫:' + result[i].stock);

        html = html + '<div class="block-21 mb-4 d-flex">' +
                      '<a href="#" class="blog-img mr-4" style="background-image: url(product_image/' + result[i].product_pict + '.jpg);"></a>' +
                      '<div class="text">' +
                      '<h3 class="heading"><a href="#">' + result[i].product_name + '</a></h3>' +
                      '<p>price: ¥ ' + result[i].price + '</p>' +
                      '<div class="meta">' +
                      '<div>' +
                      '<form action="/cartnumch" method="get">' +
                      '<div >' +
                      '<input type="submit" name="down" value="ー" class="btn-flat-border"/>' +
                      '<input type="text" name="cartnum" size="1" value="' + result[i].product_num + '" readonly style="margin: 0px 5px 0px 5px;"/>' +
                      '<input type="submit" name="up" value="＋" class="btn-flat-border"/>' +
                      '<input type="hidden" name="productid" value="' + result[i].product_id + '">' +
                      '</div>' +
                      '</form>' +
                      '</div>' +
                      '<div><a href="/delete?productid=' + result[i].product_id + '"><span class="icon-delete"></span>Delete</a></div>' +
                      '</div>' +
                      '</div>' +
                      '</div>';

                      sumPrice = sumPrice + (result[i].price * result[i].product_num);
                      count++;

         }

      html = html + '<p>total fee ¥:' + sumPrice + '</p>';
      //html = html + '<ul class="tagcloud"><a href="/payment" class="tag-cloud-link">payment</a></ul>'
      html = html + '<button onClick="dialogShow(' + sumPrice + ')" class="btn-flat-border">payment</button>'

      $('#cart_show').html(html);


    } else {
      console.log('カート非表示');
    }


  }).fail(function(e) {
    console.log('error:' + e);
    alert('通信失敗');

  }).always(function(result) {
    //常に動く

  });
}


//alertの決済ボタンがおされた時にサーバーに対して通信する。
function dialogShow(sumPrice) {

  if (window.confirm('合計金額は、' + sumPrice + 'です。決済しますか？')) {


    $.ajax({
      url: '/payment',
      type: 'GET',
      data:{
        result_show: 'payment!!'
      }
    }).done(function(result) {
      console.log('受け取った返事:' + result);
      cartLoginOnly();
      alert('決済が成功しました。ありがとう！');


    }).fail(function(e) {
      console.log('error:' + e.val());
      alert('決済失敗!!');
    }).always(function(result) {
      //常に動く場所
    });

  } else {
    alert('決済はキャンセルされました。');
  }


}
