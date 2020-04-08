const hamburger = document.querySelector('.burger');
const navUl = document.querySelector('.nav__ul');
const navItems = document.querySelectorAll('.nav__item');

hamburger.addEventListener('click', () => {
  navUl.classList.toggle('nav__ul--open');
});
