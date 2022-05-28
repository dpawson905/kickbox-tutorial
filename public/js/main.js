$(document).ready(function () {
  $(document).scroll(function () {
    let $nav = $(".fixed-top");
    let $hero = $(".hero");
    $nav.toggleClass('scrolled', $(this).scrollTop() >= $hero.height() -100);
  });
});