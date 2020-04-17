




$('#submit').on('click', function() {
  //account作成
  console.log('####button ckick####');
  var nameCheck = false;
  var emailCheck = false;
  var phoneCheck = false;
  var cityCheck = false;
  var addressCheck = false;
  var passwdCheck1 = false;
  var passwdCheck2 = false;
  var passwdOK = false;
  var name = $('#name').val();
  var email = $('#email').val();
  var phone = $('#phone').val();
  var city = $('#city').val();
  var address = $('#address').val();
  var passwd1 = $('#password1').val();
  var passwd2 = $('#password2').val();

  if (name != '') {
    nameCheck = true;
  }

  if (email != '') {
    emailCheck = true;
  }

  if (phone != '') {
    var result = $.isNumeric(phone);
    if (result) {
      phoneCheck = true;
      console.log('数値です');
    } else {
      $('#phone').val('');
      $('#phone').attr('placeholder','Please enter a number')
    }
  }

  if (city != '') {
    cityCheck = true;
  } else {
    $('#name').attr('placeholder','Please enter your name');
  }

  if (address != '') {
    addressCheck = true;
  }

  if (passwd1 != '' && $('#password1').val().length >= 8) {
    passwdCheck1 = true;
  } else {
    $('#password1').val('');
    $('#password1').attr('placeholder','Please enter at least 8 characters');
  }

  if (passwd2 != '' && $('#password1').val().length >= 8) {
    passwdCheck2 = true;
  } else {
    $('#password2').val('');
    $('#password2').attr('placeholder','Please enter at least 8 characters');
  }

  if (passwdCheck1 && passwdCheck2) {
    if (passwd1 === passwd2) {
      passwdOK = true;
    } else {
      $('#password1').val('');
      $('#password2').val('');
    }
  }


  if ((nameCheck) && (emailCheck) && (phoneCheck) && (cityCheck) && (addressCheck) && (passwdOK)) {
    console.log('AllOkk!!');
    $.ajax({
      url: '/accheck',
      type: 'GET',
      data:{
        name_result: name,
        email_reslt: email,
        phone_result: phone,
        city_result: city,
        addrss_result: address,
        passwd_result: passwd1,
      }
    }).done(function(results) {
      if (results == 'registok!!') {
        console.log('hoge:' + results);
        location.href = '/login';
      }

    }).fail(function(e) {
      console.log('error:' + e);
      alert('通信失敗!!');
    }).always(function(results) {
      //常に動く
    });
  }




});
