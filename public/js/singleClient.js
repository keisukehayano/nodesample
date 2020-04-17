$(window).on('load', function() {
  console.log('####load####');
  var productId = getParam('productid');
  getProduct(productId);
  loginSessionCheck();
  cartLoginOnly();
});


function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getProduct(productId) {

  $.ajax({
    url: "/dbp",
    type: "GET",
    data: {
      result_show: productId
    }

  }).done(function(result) {

    

    var resHtml = result;

    $('#show').html(resHtml);


  }).fail(function(e) {
    console.log('error:' + e);
    alert('通信失敗');

  }).always(function(result) {
    //常に動く

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
        $('#accountimg').attr('src', pictPath);
        console.log('画像書き換え!!');
      }
      $('#logbutton').text('Logout')
      $('#logbutton').attr('href', '/logout');
      $('#accountname').text(name);
      $('#accountstatus').text('Hello!!');

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
      html = '';
      $('#cart_show').html(html);
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
