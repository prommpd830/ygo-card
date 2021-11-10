$(window).scroll(function(){
    if ($(this).scrollTop() > 500) {
        $('.gobtn').fadeIn();
    } else {
        $('.gobtn').fadeOut();
    }
});

$(document).ready(function () {

	$('.gobtn').click(function(){
	    $('html, body').animate({scrollTop: 0},800);
	});

	function loadPage(href = 'home.html') {
		$.ajax({
			url: href,
			type: 'get',
			dataType: 'html',
			beforeSend: function () {
				$('#loading-main').removeClass('d-none');
			},
			complete: function () {
				$('#loading-main').addClass('d-none');
			},
			success: function (respond) {
				$('#main').html(respond);
			},
			error: function (respond) {
				alert(respond.status);
			}
		})
	}


	$('.navbar .navbar-nav .nav-link').on('click', function (e) {
		e.preventDefault();

		let href = $(this).attr('href');
        $.cookie('page', href, { expires: 7, path: '/' });
		loadPage(href);
	})

	// check theme
    loadPage($.cookie('page'));
})