// ! DOM ELEMENTS
const dom = {
  activeSlide: 'pages__slide--active',
  backgrounds: [
    `radial-gradient(#5d7786, #343e3d)`,
    `radial-gradient(#fd9903, #ac3701)`,
    `radial-gradient(#4e3022, #161616)`
  ],
  imgLeft: '.page__img--left',
  imgRight: '.page__img--right',
  pageHead: '.page__header',
  pageContent: '.page__content'
};
const domEl = {
  slides: Array.from(document.querySelectorAll('.pages__slide')),
  pages: Array.from(document.querySelectorAll('.page'))
};
function getAnimationEls(curPage, nextPage) {
  return {
    curImgLeft: curPage.querySelector(dom.imgLeft),
    curImgRight: curPage.querySelector(dom.imgRight),
    curHeader: curPage.querySelector(dom.pageHead),
    curContent: curPage.querySelector(dom.pageContent),
    nextImgLeft: nextPage.querySelector(dom.imgLeft),
    nextImgRight: nextPage.querySelector(dom.imgRight),
    nextHeader: nextPage.querySelector(dom.pageHead),
    nextContent: nextPage.querySelector(dom.pageContent),
    background: document.querySelector('.slide-cont')
  };
}

// ! Dot Navegation
let cur = 0;
//Change Dot Function
const changeDot = dot => {
  domEl.slides.forEach(el => {
    el.classList.remove(dom.activeSlide);
  });
  domEl.slides[dot].classList.add(dom.activeSlide);
};

//! Change Page Function

const changeAnimations = toPage => {
  // Define curPage and nextPage html elements
  const [curPage, nextPage] = [domEl.pages[cur], domEl.pages[toPage]];
  console.log(curPage, nextPage, toPage);
  const e = getAnimationEls(curPage, nextPage);
  //Animation
  const tl = gsap.timeline();
  tl.fromTo(e.curImgLeft, 0.3, { y: '-10%' }, { y: '-100%' })
    .fromTo(e.curImgRight, 0.3, { y: '10%' }, { y: '120%' }, '-=0.3')
    .to(e.background, 0.3, { backgroundImage: dom.backgrounds[toPage] })
    .fromTo(
      curPage,
      0.3,
      { opacity: 1, pointerEvents: 'all' },
      { opacity: 0, pointerEvents: 'none' },
      '-=0.1'
    )
    .fromTo(
      nextPage,
      0.3,
      { opacity: 0, pointerEvents: 'none' },
      { opacity: 1, pointerEvents: 'all' },
      '-=0.5'
    )
    .fromTo(e.nextImgLeft, 0.3, { y: '-100%' }, { y: '-10%' }, '-=0.4')
    .fromTo(e.nextImgRight, 0.3, { y: '120%' }, { y: '10%' }, '-=0.4')
    .fromTo(
      e.nextHeader,
      0.3,
      { y: '20%', opacity: 0 },
      { y: '0%', opacity: 1 },
      '-=0.3'
    )
    .fromTo(e.nextContent, 0.3, { opacity: 0 }, { opacity: 1 }, '-=0.3')
    .set(e.nextImgLeft, { clearProps: 'all' })
    .set(e.nextImgRight, { clearProps: 'all' });
};
// !Wheel Functions
// Limit scroll function calls
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
const determineToPage = function(dir, cur) {
  // Below 0 is down above 0 is up
  const arrLength = domEl.slides.length;
  let toPage;
  if (cur === arrLength - 1 && dir < 0) {
    toPage = 0;
  } else if (cur === 0 && dir > 0) {
    toPage = arrLength - 1;
  } else if (dir > 0) {
    toPage = cur - 1;
  } else if (dir < 0) {
    toPage = cur + 1;
  }
  return toPage;
};
const scrollChange = function(context) {
  const toPage = determineToPage(context.wheelDelta, cur);
  changePage(toPage);
};

// ! Controller

const changePage = toPage => {
  changeDot(toPage);
  changeAnimations(toPage);
  cur = toPage;
};

// !Event Listeners
domEl.slides.forEach(el => {
  el.addEventListener('click', function() {
    const toPage = domEl.slides.indexOf(this);
    changePage(toPage);
  });
});
// Wheel
document.addEventListener('wheel', throttle(scrollChange, 1500));
document.addEventListener('touchmove', throttle(scrollChange, 1500));
