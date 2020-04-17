
$('#submit').on('click', function() {
  var userId = $('#userid').val();
  var userPasswd = $('#userpasswd').val();

  loginVerification(userId, userPasswd);

  $('#userid').val('');
  $('#userpasswd').val('');

});





function loginVerification(userId,userPasswd) {

  if (userId != '' && userPasswd != '') {

$.ajax({
  url: '/locheck',
  type: 'GET',
  data:{
    user_id: userId,
    user_passwd: userPasswd
  }

}).done(function(result) {

  //index.htmlへリダイレクト
  if (result == 'PASSOK!!'){
  location.href = '/';
}

}).fail(function(e) {
  console.log('error:' + e);
  alert('通信失敗!!');

}).always(function(result) {
  //常に実行される
});

}
}
