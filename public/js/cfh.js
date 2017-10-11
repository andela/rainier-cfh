$(document).ready(function(){
  // Add modal
  $('.modal').modal();
  // Add window tabs
  $(document).ready(function(){
    $('ul.tabs').tabs();
  });
  // Add shadow to header on scroll
  $(window).scroll(function() {     
    var scroll = $(window).scrollTop();
    if (scroll > 60) {
        $(".main-header").addClass("dimension");
    }
    else {
        $(".main-header").removeClass("dimension");
    }
});
  // Setup responsive header
  const mobileNav = $('#mobile-nav');
  // Responsive page header navigation
  mobileNav.html($('.nav-list').html());
  $('.nav-mobile').click(function navHandler() {
    if (mobileNav.hasClass('expanded')) {
      $('#mobile-nav.expanded').removeClass('expanded').slideUp(500);
      $(this).removeClass('open');
    } else {
      mobileNav.addClass('expanded').slideDown(500);
      $(this).addClass('open');
    }
  });// end of header nav

  // Watch and add scroll to in-page anchor references
  $('.scrollspy').scrollSpy();
  $('a').on('click', function(event) {
    $('.current').removeClass('current');
    $(this).addClass('current');
  });
});
