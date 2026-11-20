// Elba page only: three acts, side switch, facade lens, season scrub.
(function () {
  var body = document.body, seam = document.querySelector('.seam'), wipe = document.querySelector('.wipe');
  var label = seam.querySelector('.txt');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function top(el) { return el.getBoundingClientRect().top + scrollY - 80; }

  function setSide(resident) {
    body.classList.toggle('is-resident', resident);
    if (resident) body.classList.add('seen-resident');
    label.textContent = resident ? 'Back to the postcard' : 'Step behind the facade';
    seam.setAttribute('aria-pressed', resident);
    scrollTo(0, top(document.querySelector('.act[data-side="' + (resident ? 'resident' : 'tourist') + '"]')));
    dispatchEvent(new Event('scroll'));
  }
  function flip(resident) {
    if (reduce) return setSide(resident);
    wipe.classList.remove('run'); void wipe.offsetWidth; wipe.classList.add('run');
    setTimeout(function () { setSide(resident); }, 420);
  }

  seam.addEventListener('click', function () { flip(!body.classList.contains('is-resident')); });
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.go === 'resident') return flip(true);
      var out = document.getElementById('out');
      scrollTo({ top: top(out), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Lens
  document.querySelectorAll('.lens').forEach(function (el) {
    var back = el.querySelector('.back'), ring = el.querySelector('.ring');
    function r() { return innerWidth < 760 ? 70 : 110; }
    function move(e) {
      var b = el.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      back.style.transition = 'none';
      back.style.clipPath = 'circle(' + r() + 'px at ' + x + 'px ' + y + 'px)';
      ring.style.left = x + 'px'; ring.style.top = y + 'px';
      el.classList.add('on');
    }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', move);
    el.addEventListener('pointerleave', function () {
      back.style.transition = ''; back.style.clipPath = back.style.clipPath.replace(/circle\([^ ]+/, 'circle(0px');
      el.classList.remove('on');
    });
  });

  // Season scrub: winter -> summer -> winter as the section scrolls past
  var s = document.querySelector('.seasons');
  if (s) {
    var summer = s.querySelector('.summer'), bar = s.querySelector('.bar i'), tag = s.querySelector('.label');
    var notes = s.querySelectorAll('.note');
    function tick() {
      var b = s.getBoundingClientRect(), span = b.height - innerHeight;
      if (span <= 0) return;
      var p = Math.min(1, Math.max(0, -b.top / span));
      var t = Math.min(1, Math.max(0, 1 - Math.abs(p - .5) / .3) * 1.4);
      summer.style.opacity = t;
      bar.style.width = (p * 100) + '%';
      tag.textContent = t > .5 ? 'High season' : 'Off season';
      notes[0].hidden = t > .5; notes[1].hidden = t <= .5;
    }
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
  }
})();

// Section: show the figures once the drawing is half in view
(function () {
  var el = document.querySelector('.section-reveal');
  if (!el || !('IntersectionObserver' in window)) { if (el) el.classList.add('in'); return; }
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { el.classList.toggle('in', e.isIntersecting); });
  }, { threshold: .45 }).observe(el);
})();

// Pocket City: load the live model only when asked, and unload it when it leaves the screen (it animates nonstop)
(function () {
  var fig = document.querySelector('.pocket'); if (!fig) return;
  var start = fig.querySelector('.pocket-start'), frame = null;
  function close() { if (!frame) return; frame.remove(); frame = null; start.hidden = false; }
  start.addEventListener('click', function () {
    frame = document.createElement('iframe');
    frame.src = start.dataset.src; frame.title = 'Rio Marina, a turnable model of the harbour and old town';
    start.hidden = true; fig.insertBefore(frame, start);
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (!e.isIntersecting) close(); });
  }).observe(fig);
  document.querySelectorAll('.seam, [data-go]').forEach(function (b) { b.addEventListener('click', close); });
})();
