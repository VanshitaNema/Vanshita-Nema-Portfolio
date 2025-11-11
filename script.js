// $(window).load(function() {
// 	$(".loader").fadeOut("fast");
// });



let layer = document.querySelector('.layer');
window.addEventListener('scroll', function(){
    let value = window.scrollY;
    layer.style.left = value*2+'px';
})


////////////////////////////////////////////////////////////////////////////////

let stars = document.getElementById('stars');
let moon = document.getElementById('moon');
let mountains_behind = document.getElementById('mountains_behind');
let text = document.getElementById('text');
let btn = document.getElementById('btn');
let mountains_front = document.getElementById('mountains_front');
let header = document.querySelector('header');

window.addEventListener('scroll', function(){
    let value = window.scrollY;
    stars.style.left = value * 0.25 + 'px';
    moon.style.top = value * 1.05 + 'px';
    mountains_behind.style.top = value * 0.5 + 'px';
    mountains_front.style.top = value * 0 + 'px';
    text.style.marginRight = value * 4 + 'px';
    text.style.marginTop = value * 1.5 + 'px';
    btn.style.marginTop = value * 1.5 + 'px';
    header.style.top = value * 0.5 + 'px';
})


gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 3.5,
  }
);

gsap.fromTo(
  ".logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 2,
    delay: 0.5,
  }
);

// Make whole project-card clickable — navigates to the URL in data-link / data-target
(function(){
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const href = card.dataset.link;
    if (!href) return;

    // show pointer and make focusable for keyboard users
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');

    // use card title for accessible name if available
    const titleEl = card.querySelector('h3');
    if (titleEl) card.setAttribute('aria-label', titleEl.textContent.trim());

    const targetAttr = card.dataset.target || '_self';

    const navigate = () => {
      if (targetAttr === '_blank') window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    };

    card.addEventListener('click', (e) => {
      // if the user actually clicked an interactive element inside the card, do nothing
      if (e.target.closest('a, button, input, textarea, select')) return;
      navigate();
    });

    // allow Enter or Space to activate the card when focused
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate();
      }
    });
  });
})();

(function(){
  const style = document.createElement('style');
  style.textContent = `
    .pre-reveal { opacity:0; transform:translateY(20px) scale(.996); transition:opacity .7s ease, transform .7s ease; will-change:opacity,transform; }
    .reveal { opacity:1; transform:none; }
    @keyframes float-soft { 0%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } 100%{ transform:translateY(0) } }
    .float-soft { animation:float-soft 6s ease-in-out infinite; }
    .project-card, .tech-item { transition: transform .28s ease, box-shadow .28s ease; will-change:transform,box-shadow; }
    .project-card:hover, .tech-item:hover, .project-card:focus, .tech-item:focus { transform: translateY(-10px) scale(1.02); box-shadow: 0 18px 40px rgba(0,0,0,.45); }
    header { transition: transform .36s ease, opacity .36s ease; will-change:transform,opacity; }
    header.hide { transform: translateY(-110%); opacity:0; }
    .bg-spotlight { pointer-events:none; position:absolute; z-index:2; mix-blend-mode:overlay; border-radius:50%; filter:blur(36px); transition:opacity .28s linear; }
    .reveal-delay-1 { transition-delay: 0.08s; }
    .reveal-delay-2 { transition-delay: 0.16s; }
    .reveal-delay-3 { transition-delay: 0.24s; }
  `;
  document.head.appendChild(style);

  const containerBg = document.querySelector('.background');
  const revealSelector = containerBg
    ? ['.background section', '.projects-section', '.tech-section', '.education-section', '.project-card', '.tech-item', '.timeline-item']
    : ['.projects-section', '.tech-section', '.education-section', '.project-card', '.tech-item', '.timeline-item'];

  const targets = Array.from(document.querySelectorAll(revealSelector.join(',')));
  targets.forEach((el,i) => {
    el.classList.add('pre-reveal');
    if (i % 3 === 0) el.classList.add('reveal-delay-1');
    else if (i % 3 === 1) el.classList.add('reveal-delay-2');
    else el.classList.add('reveal-delay-3');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => io.observe(t));

  ['moon','stars','mountains_front','mountains_behind','layer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('float-soft');
  });

  const header = document.querySelector('header');
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) header.classList.add('hide');
      else header.classList.remove('hide');
      lastY = y;
    }, { passive: true });
  }

  if (containerBg) {
    const spot = document.createElement('div');
    spot.className = 'bg-spotlight';
    spot.style.width = '48vmax';
    spot.style.height = '48vmax';
    spot.style.background = 'radial-gradient(circle at center, rgba(255,200,255,0.12), rgba(255,120,200,0.04) 36%, rgba(0,0,0,0) 68%)';
    spot.style.opacity = '0';
    containerBg.prepend(spot);

    let tx = -9999, ty = -9999, cx = -9999, cy = -9999, visible = false;
    function onMove(e){
      const r = containerBg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      tx = clientX - r.left; ty = clientY - r.top;
      visible = true; spot.style.opacity = '1';
    }
    function onLeave(){ visible = false; spot.style.opacity = '0'; tx = ty = -9999; }

    containerBg.addEventListener('mousemove', onMove, { passive: true });
    containerBg.addEventListener('touchmove', onMove, { passive: true });
    containerBg.addEventListener('mouseleave', onLeave);
    containerBg.addEventListener('touchend', onLeave);

    (function loop(){
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (visible || Math.abs(cx - tx) > 0.5 || Math.abs(cy - ty) > 0.5) {
        spot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%,-50%)`;
      }
      requestAnimationFrame(loop);
    })();
  }

})();


