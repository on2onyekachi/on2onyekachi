/* Case study pages: highlight the current section in the side list, and fade content in once. */
(() => {
  const links = [...document.querySelectorAll('.case-toc a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => spy.observe(s));

    const show = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); show.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => show.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  }
})();

// copy my email
document.querySelectorAll('[data-copy]').forEach(btn => {
  let timer;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); }
    catch (e) {
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
