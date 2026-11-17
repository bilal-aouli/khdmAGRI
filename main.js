/* KHADMA AGRI — الحركة: GSAP + ScrollTrigger + Lenis (تأثيرات مستوحاة من React Bits) */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // لا حركة إذا فضّل المستخدم تقليلها أو لم تُحمَّل المكتبات: كل المحتوى يبقى ظاهراً
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* 1) Lenis مربوط مع ticker تبع GSAP */
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* 2) Blur Text: ظهور الكلمات بتدرج (التقسيم بالكلمة حتى لا ينقطع اتصال الحروف العربية) */
  document.querySelectorAll('[data-blur-text]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w) {
      return '<span class="bt-word" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    gsap.fromTo(el.querySelectorAll('.bt-word'),
      { opacity: 0, filter: 'blur(10px)', y: 18 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.14, delay: 0.15 });
  });

  /* 3) Light Rays: أشعة هادئة تتمايل ببطء */
  document.querySelectorAll('.ray').forEach(function (ray, i) {
    gsap.to(ray, {
      rotation: '+=' + (i % 2 ? -5 : 5),
      opacity: '+=0.12',
      duration: 7 + i * 1.3,
      ease: 'sine.inOut', repeat: -1, yoyo: true
    });
  });

  /* 4) ظهور ناعم لكل قسم أثناء التمرير */
  gsap.utils.toArray('[data-reveal]').forEach(function (sec) {
    gsap.from(sec, {
      opacity: 0, y: 28, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: sec, start: 'top 85%', once: true }
    });
  });

  /* 5) عدّاد الأرقام */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });
})();
