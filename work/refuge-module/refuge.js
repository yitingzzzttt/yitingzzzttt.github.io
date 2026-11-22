// Refuge Module page behaviour.
(function () {
  // 1. Narrative drawing: bring one band forward per text step.
  var box = document.querySelector("[data-story]");
  if (box) {
    var bands = box.querySelectorAll(".layer"), steps = box.querySelectorAll("[data-step]");
    var show = function (i) { bands.forEach(function (b) { b.classList.toggle("on", +b.dataset.band <= +i); }); };
    show(0);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) show(e.target.dataset.step); });
      }, { rootMargin: "-35% 0px -35% 0px" });
      steps.forEach(function (s) { io.observe(s); });
    } else bands.forEach(function (b) { b.classList.add("on"); });
  }
  // 2. Route: the boat sails along the river with scrolling and lights each city it reaches.
  var route = document.querySelector("[data-route]");
  if (!route) return;
  var run = route.querySelector(".river-run"), boat = route.querySelector(".boat"), card = route.querySelector(".stop-card");
  var len = run.getTotalLength(), cities = [].slice.call(route.querySelectorAll(".city"));
  // distance along the path of each city
  cities.forEach(function (c) {
    var cx = +c.querySelector("circle").getAttribute("cx"), cy = +c.querySelector("circle").getAttribute("cy"), best = 0, bd = 1e9;
    for (var s = 0; s <= len; s += 2) { var p = run.getPointAtLength(s), dd = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy); if (dd < bd) { bd = dd; best = s; } }
    c._at = best;
  });
  run.style.strokeDasharray = len; 
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function draw() {
    var r = route.getBoundingClientRect(), total = route.offsetHeight - innerHeight;
    var t = reduce || total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total));
    var at = t * len, p = run.getPointAtLength(at), q = run.getPointAtLength(Math.min(len, at + 1));
    run.style.strokeDashoffset = len - at;
    var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    boat.setAttribute("transform", "translate(" + p.x + "," + p.y + ") rotate(" + ang + ")");
    var cur = null, n = 0;
    cities.forEach(function (c, i) { var lit = c._at <= at + 1; c.classList.toggle("lit", lit); if (lit) { cur = c; n = i + 1; } });
    if (cur && card && card._city !== cur) {
      card._city = cur;
      card.querySelector(".sc-n").textContent = n + " / " + cities.length;
      card.querySelector(".sc-city").textContent = cur.dataset.at;
      card.querySelector(".sc-meta").textContent = cur.dataset.country + " · " + cur.dataset.water;
      card.querySelectorAll("[data-k]").forEach(function (i) { i.style.width = (+cur.dataset[i.dataset.k] / 5 * 100) + "%"; });
      card.querySelector(".sc-km").textContent = (+cur.dataset.km).toLocaleString("en-US") + " km";
    }
  }
  addEventListener("scroll", draw, { passive: true }); addEventListener("resize", draw); draw();
})();
