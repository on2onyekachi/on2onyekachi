/*
 * Motion for index.html
 *  1. The portrait card hangs on a nail. A bird keeps landing on its high corner
 *     to set it straight; a few seconds later it tips over to the other side.
 *  2. "My periodic tech stack" opens as a popup that hangs the same way,
 *     with its own bird doing the same job.
 *  3. "See more" panels on each project open and close smoothly.
 *  4. The footer email can be copied with one click.
 */

const MOTION_OK = !matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * A card hanging from a nail, kept straight by a bird.
 * stage: the element the bird flies inside   rig: the card's fixed position
 * swing: the part that rotates around the nail   bird: the bird element
 */
function hangingCard({ stage, rig, swing, bird, tilt = 5, nail = 22, inset = 0.2, firstDelay = 1.4 }) {
  const wing = bird.querySelector('.bird-wing');
  const legs = bird.querySelector('.bird-legs');
  const T = () => (typeof tilt === 'function' ? tilt() : tilt);   // tilt can depend on screen size
  let angle = T();           // current angle (positive = right side lower)
  let current = null;        // the timeline or delayed call that is playing now
  const setSwing = gsap.quickSetter(swing, 'rotation', 'deg');

  // where the bird's feet should be: on the card's top edge, near the high corner
  const perch = (a, corner) => {
    const s = stage.getBoundingClientRect();
    const r = rig.getBoundingClientRect();
    const ox = stage.scrollLeft - s.left, oy = stage.scrollTop - s.top;
    const px = r.left + ox + r.width / 2;
    const py = r.top + oy - nail;
    const x = corner === 'left' ? r.left + ox + r.width * inset : r.right + ox - r.width * inset;
    const y = r.top + oy;
    const rad = a * Math.PI / 180, dx = x - px, dy = y - py;
    return { x: px + dx * Math.cos(rad) - dy * Math.sin(rad), y: py + dx * Math.sin(rad) + dy * Math.cos(rad) };
  };

  const placeBird = (p, rot, face) => {
    gsap.set(bird, { x: p.x - bird.offsetWidth * 0.52, y: p.y - bird.offsetHeight * 0.94, rotation: rot, scaleX: face });
  };

  gsap.set(wing, { transformOrigin: '96% 55%' });
  gsap.set(legs, { opacity: 0 });
  const flap = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
    .fromTo(wing, { rotation: -24 }, { rotation: 58, duration: 0.11, ease: 'sine.inOut' });
  const startFlap = () => { flap.play(); gsap.set(legs, { opacity: 0 }); };
  const glide = () => { flap.pause(); gsap.to(wing, { rotation: 40, duration: 0.25 }); };
  const fold = () => { flap.pause(); gsap.to(wing, { rotation: 0, duration: 0.3, ease: 'power2.out' }); gsap.to(legs, { opacity: 1, duration: 0.15 }); };
  const quad = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
  // rotate the card from one angle to another; `follow` runs every frame (used to carry the bird)
  const tween = (from, to, vars, follow) => gsap.to({ a: from }, { a: to, ...vars, onUpdate() { angle = this.targets()[0].a; setSwing(angle); follow && follow(); } });

  function cycle() {
    const corner = angle > 0 ? 'left' : 'right';   // the high corner
    const face = corner === 'left' ? 1 : -1;        // the bird faces the way it flies
    const W = stage.clientWidth;
    const land = perch(angle, corner);
    const start = { x: corner === 'left' ? -120 : W + 120, y: land.y - 280 };
    const exit  = { x: corner === 'left' ? W + 140 : -140, y: land.y - 340 };
    const fly = { t: 0 };
    const from = angle;

    return gsap.timeline({ onComplete: () => { current = gsap.delayedCall(2.2, () => { current = cycle(); }); } })
      // fly in on a swooping curve
      .call(() => { gsap.set(bird, { opacity: 1 }); startFlap(); })
      .to(fly, {
        t: 1, duration: 2, ease: 'power1.inOut',
        onUpdate: () => {
          const target = perch(angle, corner);
          const cx = (start.x + target.x) / 2, cy = target.y - 30;
          placeBird({ x: quad(start.x, cx, target.x, fly.t), y: quad(start.y, cy, target.y, fly.t) },
            gsap.utils.interpolate(14 * face, angle, fly.t), face);
        }
      })
      .call(glide, null, '-=0.45')
      .call(fold)
      .to(bird, { scaleY: 0.88, duration: 0.12, ease: 'power2.out', transformOrigin: '50% 94%' })
      .to(bird, { scaleY: 1, duration: 0.25, ease: 'back.out(3)' })
      // its weight pushes the card upright; the bird rides the corner down
      .add(tween(from, 0, { duration: 1.2, ease: 'back.out(1.6)' }, () => placeBird(perch(angle, corner), angle, face)), '+=0.25')
      // a quick look around, then take off over the card
      .to(bird, { rotation: -6 * face, duration: 0.18, yoyo: true, repeat: 1, delay: 0.35 })
      .call(startFlap, null, '+=0.25')
      .set(fly, { t: 0 })
      .to(fly, {
        t: 1, duration: 1.7, ease: 'power1.in',
        onUpdate: () => {
          const s = perch(0, corner);
          placeBird({ x: quad(s.x, (s.x + exit.x) / 2, exit.x, fly.t), y: quad(s.y, s.y - 160, exit.y, fly.t) }, -12 * face, face);
        }
      })
      .set(bird, { opacity: 0 })
      // the card holds still, trembles, then tips to the other side
      .to({}, { duration: 2.6 })
      .add(gsap.to({ a: 0 }, { a: 0.7 * -face, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut', onUpdate() { angle = this.targets()[0].a; setSwing(angle); } }))
      .add(tween(0, -face * T() * 1.35, { duration: 0.55, ease: 'power2.in' }))
      .add(tween(-face * T() * 1.35, -face * T(), { duration: 1.8, ease: 'elastic.out(1, 0.32)' }));
  }

  return {
    start(delay = firstDelay) {
      this.stop();
      angle = T(); setSwing(angle);
      current = gsap.delayedCall(delay, () => { current = cycle(); });
    },
    stop() {
      if (current) current.kill();
      current = null; flap.pause();
      gsap.killTweensOf(bird);
      gsap.set(bird, { opacity: 0 });
    },
    pause() { current && current.pause(); flap.pause(); },
    resume() { current && current.resume(); }
  };
}

/* ---------- 1. the landing page card ---------- */
let heroCard = null;
if (window.gsap && MOTION_OK) {
  gsap.registerPlugin(ScrollTrigger);
  const hero = document.querySelector('.hero');
  const rig = hero.querySelector('.card-rig');

  // the card drifts up slightly as you scroll away (the name stays still)
  gsap.to(rig, {
    y: () => -innerHeight * 0.12, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
  });

  heroCard = hangingCard({ stage: hero, rig, swing: hero.querySelector('.card-swing'), bird: hero.querySelector('.bird') });
  heroCard.start();

  // only animate while the landing page is on screen
  ScrollTrigger.create({
    trigger: hero, start: 'top bottom', end: 'bottom top',
    onToggle: self => (self.isActive ? heroCard.resume() : heroCard.pause())
  });
}

/* ---------- 2. My periodic tech stack ---------- */
(() => {
  const dialog = document.querySelector('.stack-dialog');
  if (!dialog) return;
  const animate = window.gsap && MOTION_OK;
  const panel = dialog.querySelector('.stack-rig');
  const stackCard = animate
    ? hangingCard({ stage: dialog.querySelector('.bird-layer'), rig: panel, swing: dialog.querySelector('.stack-swing'), bird: dialog.querySelector('.bird'), tilt: () => (matchMedia('(max-width: 760px)').matches ? 0.8 : 2.4), nail: 22, inset: 0.12, firstDelay: 0.7 })
    : null;
  let opener = null;

  const open = btn => {
    opener = btn;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    if (animate) {
      heroCard && heroCard.pause();
      gsap.fromTo(panel, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' });
      gsap.fromTo(dialog.querySelectorAll('.el, .periodic-key'), { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: { each: 0.035, from: 'center' }, delay: 0.15 });
      stackCard.start();
    }
  };

  const close = () => {
    if (!dialog.open) return;
    const done = () => {
      stackCard && stackCard.stop();
      dialog.close();
      document.documentElement.style.overflow = '';
      heroCard && heroCard.resume();
      opener && opener.focus();
    };
    if (animate) gsap.to(panel, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done });
    else done();
  };

  document.querySelectorAll('[data-open-stack]').forEach(btn => btn.addEventListener('click', () => open(btn)));
  dialog.querySelector('[data-close-stack]').addEventListener('click', close);
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });                  // Esc
  dialog.addEventListener('click', e => { if (e.target === dialog) close(); });              // click outside the panel
})();

/* ---------- 3. "See more" on each project ---------- */
(() => {
  document.querySelectorAll('.project-more').forEach(details => {
    const summary = details.querySelector('summary');
    const body = details.querySelector('.project-more-body');
    let anim = null;

    summary.addEventListener('click', e => {
      if (!MOTION_OK) return;
      e.preventDefault();
      if (anim) anim.cancel();
      const opening = !details.open;
      if (opening) details.open = true;
      const full = body.scrollHeight;
      anim = body.animate(
        opening
          ? [{ height: '0px', opacity: 0 }, { height: full + 'px', opacity: 1 }]
          : [{ height: full + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: opening ? 520 : 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
      );
      anim.onfinish = () => { anim = null; if (!opening) details.open = false; };
    });
  });
})();

/* ---------- 4. copy my email ---------- */
document.querySelectorAll('[data-copy]').forEach(btn => {
  let timer;
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // older browsers: select the text so it can be copied by hand
      const range = document.createRange();
      range.selectNodeContents(btn.previousElementSibling);
      getSelection().removeAllRanges(); getSelection().addRange(range);
    }
    btn.textContent = 'Copied';
    btn.classList.add('is-copied');
    clearTimeout(timer);
    timer = setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 2000);
  });
});
