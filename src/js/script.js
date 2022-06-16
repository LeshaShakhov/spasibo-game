$(function () {
  $("#button").click(function () {
    var name = $("#name").val();
    var email = $("#email").val();
    var city  = $("#city").val();
    $.ajax({
      url: "handler/script.php",
      type: 'post',
      data: {
        name: name,
        email: email,
        city: city
      },
        success: function () {
            ga('send', {
                hitType: 'event',
                eventCategory: 'registered',
                eventAction: 'registered',
                eventLabel: 'пользователь зарегистрирован'
            });
        }
    });
  });
});

