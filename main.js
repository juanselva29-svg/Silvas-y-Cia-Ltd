(function ($) {
    "use strict";

    // Preloader
    $(window).on('load', function () {
        if ($('#preloader').length) {
            $('#preloader').delay(100).fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });

    // Initialize WOW.js
    new WOW().init();
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        center: true,
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    // Header carousel
    var headerCarousel = $(".header-carousel");
    headerCarousel.owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    // Carousel Animations
    headerCarousel.on('translate.owl.carousel', function () {
        $('.header-carousel .slider-animation').each(function () {
            var $this = $(this);
            $this.removeClass('animated ' + $this.data('animation')).css('opacity', '0');
        });
    });

    headerCarousel.on('translated.owl.carousel', function () {
        $('.header-carousel .owl-item.active .slider-animation').each(function () {
            var $this = $(this);
            var animationName = $this.data('animation');
            var delayName = $this.data('delay');
            
            $this.css({
                'animation-delay': delayName,
                'opacity': '1'
            }).addClass('animated ' + animationName);
        });
    });
    
    // Trigger initial animation
    $('.header-carousel .owl-item.active .slider-animation').each(function () {
        var $this = $(this);
        var animationName = $this.data('animation');
        var delayName = $this.data('delay');
        
        $this.css({
            'animation-delay': delayName,
            'opacity': '1'
        }).addClass('animated ' + animationName);
    });

    // Mobile Offcanvas Menu logic
    $('.navbar-toggler').on('click', function () {
        $('body').toggleClass('offcanvas-open');
    });

    // Close offcanvas when clicking outside (backdrop) or on a link
    $(document).on('click', function (e) {
        if ($('body').hasClass('offcanvas-open') && 
            !$(e.target).closest('.navbar-collapse').length && 
            !$(e.target).closest('.navbar-toggler').length) {
            $('.navbar-collapse').collapse('hide');
            $('body').removeClass('offcanvas-open');
        }
    });

    $('.navbar-nav .nav-link, .dropdown-item').on('click', function () {
        if ($(this).hasClass('dropdown-toggle')) {
            return;
        }
        if ($('body').hasClass('offcanvas-open')) {
            $('.navbar-collapse').collapse('hide');
            $('body').removeClass('offcanvas-open');
        }
    });

    // Custom Web3Forms AJAX Submission to avoid redirect page
    $('form[action="https://api.web3forms.com/submit"]').on('submit', function (e) {
        // web3forms script might validate hcaptcha, but we intercept the submit here.
        e.preventDefault();
        var form = this;
        var $form = $(form);
        var submitBtn = $form.find('button[type="submit"]');
        var originalText = submitBtn.text();
        submitBtn.text('Enviando...').prop('disabled', true);

        var formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
                var message = $form.find('input[name="Email"]').closest('.input-group').length > 0 
                                ? '¡Gracias por suscribirte al boletín!' 
                                : '¡Mensaje Enviado!<br><small>Nos pondremos en contacto pronto.</small>';
                                
                var successHtml = '<div class="alert alert-success text-center py-3 m-0" style="border-radius: 5px;">' +
                                  '<i class="fa fa-check-circle fa-2x mb-2 text-success"></i><br>' +
                                  '<strong>' + message + '</strong>' +
                                  '</div>';
                $form.html(successHtml);
            } else {
                alert('Hubo un error al enviar: ' + data.message);
                submitBtn.text(originalText).prop('disabled', false);
            }
        })
        .catch(function(error) {
            alert('Error de conexión. Intente nuevamente.');
            submitBtn.text(originalText).prop('disabled', false);
        });
    });
    
})(jQuery);

