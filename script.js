/* script.js - interactions for the monthsary site (updated with music star control & autoplay attempt) */

/* ====== Data (replace with personal data/images) ====== */

const storyScenes = [
  "We first locked eyes under the warm lights of that cosy café — your laugh was the kind that made time slow. I remember the way you tucked your hair behind your ear.",
  "Our first date felt like a dream stitched into daylight: silly conversation, long walks and the sort of silence that felt comfortable, like two hearts in the same rhythm.",
  "We shared secrets over late-night messages and found the small, beautiful ways to make each other smile. Every day felt like the start of something tender.",
  "Today, a month on, I wanted to gather all these soft moments and give them back to you — a tiny page of love for our first monthsary."
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=ea8df5b2b2a2f95c8f7a4ec2a6f9d1ed", caption: "That evening we wandered the streets" },
  { src: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3aee1f7d7b6e0a73b6f41be724b1d9e8", caption: "Sunset coffee" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d042eb7233b24d5ef6f4c5c8a8f6a5a", caption: "A quiet laugh" },
  { src: "https://images.unsplash.com/photo-1521302080254-2c2b0c57b0a6?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3072b0ee4e2a1e2b1d247b5d6f9e9f77", caption: "Tiny hand in mine" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=76a6f9c0f4b6a5f9c9c0f8a6b9d3f1e8", caption: "Walking home together" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8e8952d8c3a2760d7f0d8a7c9a1c9f3a", caption: "A shared sunset" }
];

const timelineItems = [
  { title: "We Met", date: "2025-09-25", detail: "We first met at the little café by the river; you smiled and I forgot to breathe for a second.", photo: galleryImages[0].src },
  { title: "Our First Date", date: "2025-09-27", detail: "We walked for hours, talked about everything and nothing, and the day felt tender and infinite.", photo: galleryImages[1].src },
  { title: "First Kiss", date: "2025-10-05", detail: "A soft, surprise kiss beneath the street lamps — warm and sweet.", photo: galleryImages[2].src },
  { title: "First Monthsary", date: "2025-10-25", detail: "A month of small joys, big smiles, and the quiet certainty that this is something rare.", photo: galleryImages[3].src }
];

/* Next monthsary target (default) — change as needed */
let nextMonthsaryDate = new Date(2025, 10, 25); // November 25, 2025. Note: months are 0-indexed.

document.addEventListener('DOMContentLoaded', () => {
  initStory();
  initGallery();
  initLightbox();
  initTypewriter();
  initTimeline();
  initCountdown();
  initAudioToggle();    // keeps header button in sync
  initMusicStar();      // initialises floating star + autoplay attempt
  spawnHearts();
});

/* ====== STORY (scenes) ====== */
let storyIndex = 0;
function initStory() {
  const sceneEl = document.getElementById('story-scene');
  const prevBtn = document.getElementById('prev-scene');
  const nextBtn = document.getElementById('next-scene');
  const progressBar = document.getElementById('story-progress');

  function render() {
    sceneEl.classList.remove('fade-in');
    void sceneEl.offsetWidth;
    sceneEl.textContent = storyScenes[storyIndex];
    sceneEl.classList.add('fade-in');
    prevBtn.disabled = storyIndex === 0;
    nextBtn.textContent = storyIndex === storyScenes.length - 1 ? "Finish ♥" : "Next →";
    const progress = Math.round(((storyIndex+1)/storyScenes.length) * 100);
    progressBar.querySelector('i') ? progressBar.querySelector('i').style.width = progress + '%' : progressBar.appendChild(document.createElement('i')).style.width = progress + '%';
  }

  prevBtn.addEventListener('click', () => { if (storyIndex>0) { storyIndex--; render(); } });
  nextBtn.addEventListener('click', () => { if (storyIndex < storyScenes.length - 1) { storyIndex++; render(); } else { document.querySelector('#gallery').scrollIntoView({behavior:'smooth'}); } });

  render();
}

/* ====== GALLERY ====== */
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  galleryImages.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.tabIndex = 0;
    item.setAttribute('role','button');
    item.setAttribute('aria-label', `Open image ${img.caption}`);
    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.caption;
    const cap = document.createElement('div');
    cap.className = 'gallery-caption';
    cap.textContent = img.caption;
    item.appendChild(image);
    item.appendChild(cap);
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keypress', (e) => { if (e.key === 'Enter') openLightbox(i); });
    grid.appendChild(item);
  });
}

/* ====== LIGHTBOX ====== */
let currentLightboxIndex = 0;
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const close = document.getElementById('lightbox-close');
  const prev = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');

  function show(index) {
    currentLightboxIndex = index;
    img.src = galleryImages[index].src;
    img.alt = galleryImages[index].caption;
    caption.textContent = galleryImages[index].caption;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hide() {
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show((currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length));
  next.addEventListener('click', () => show((currentLightboxIndex + 1) % galleryImages.length));
  lb.addEventListener('click', (e) => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', (e) => {
    if (lb.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') prev.click();
      if (e.key === 'ArrowRight') next.click();
    }
  });

  window.openLightbox = show;
}

/* ====== TYPEWRITER MESSAGE ====== */
const loveNote = `My dearest,
Each day with you feels gentle and bright — like lilac light at dusk. Thank you for your smile, your warmth and for making a month feel like forever.
With all my heart,
Yours. 💜`;

let typing = false;
function initTypewriter() {
  const el = document.getElementById('typewriter');
  const replay = document.getElementById('replay-type');
  const download = document.getElementById('download-note');

  function typeText(text, target) {
    typing = true;
    target.textContent = '';
    let i = 0;
    const speed = 34;
    const interval = setInterval(() => {
      const chunk = text.slice(i, i+1);
      target.textContent += chunk;
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        typing = false;
      }
    }, speed);
  }
  typeText(loveNote, el);

  replay.addEventListener('click', () => {
    if (!typing) typeText(loveNote, el);
  });

  // prepare downloadable note
  download.addEventListener('click', () => {
    const blob = new Blob([loveNote], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    download.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
}

/* ====== TIMELINE ====== */
function initTimeline() {
  const wrap = document.getElementById('timeline-wrap');
  timelineItems.forEach((t, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('role','listitem');
    const h3 = document.createElement('h3'); h3.textContent = t.title;
    const ts = document.createElement('div'); ts.className = 'ts'; ts.textContent = new Date(t.date).toLocaleDateString();
    const detail = document.createElement('div'); detail.className = 'detail';
    detail.innerHTML = `<p>${t.detail}</p><img src="${t.photo}" alt="${t.title}" style="width:100%; margin-top:.6rem; border-radius:8px;">`;
    item.appendChild(h3); item.appendChild(ts); item.appendChild(detail);
    item.addEventListener('click', () => {
      // close others
      document.querySelectorAll('.timeline-item.open').forEach(e => e.classList.remove('open'));
      item.classList.toggle('open');
      // scroll into view smoothly for mobile
      setTimeout(() => item.scrollIntoView({behavior:'smooth', block:'center'}), 120);
    });
    wrap.appendChild(item);
  });
}

/* ====== COUNTDOWN ====== */
function initCountdown() {
  const el = document.getElementById('countdown');

  function update() {
    const now = new Date();
    let target = nextMonthsaryDate;

    // If target is in the past, pick next month same day
    if (target <= now) {
      // add 1 month
      const y = target.getFullYear();
      const m = target.getMonth() + 1;
      const d = target.getDate();
      target = new Date(y, m, d);
      nextMonthsaryDate = target;
    }

    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    el.textContent = `${days} days • ${hrs}h ${mins}m ${secs}s left until our next monthsary 💜`;
  }

  update();
  setInterval(update, 1000);
}

/* ====== AUDIO CONTROLS (header button kept in sync) ====== */
function initAudioToggle() {
  const audio = document.getElementById('bg-music');
  const btn = document.querySelector('.audio-toggle');
  const star = document.getElementById('music-star');

  function syncButtons() {
    const playing = !audio.paused && !audio.ended;
    btn.textContent = playing ? 'Pause ♫' : 'Play ♫';
    btn.setAttribute('aria-pressed', String(playing));
    if (star) {
      // visually reflect playing or paused; keep muted class if audio.muted
      star.classList.toggle('playing', playing && !audio.muted);
      star.classList.toggle('muted', audio.muted && playing);
      star.setAttribute('aria-pressed', String(playing));
    }
  }

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        // prefer to unmute if user explicitly requested
        audio.muted = false;
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e) {
      // possibly blocked; if blocked, ask user gesture via star
      console.warn('Play blocked or failed:', e);
    } finally {
      syncButtons();
    }
  });

  // Keep header button updated if audio state changes elsewhere
  audio.addEventListener('play', syncButtons);
  audio.addEventListener('pause', syncButtons);
  audio.addEventListener('volumechange', syncButtons);
  audio.addEventListener('ended', syncButtons);
}

/* ====== MUSIC STAR (floating control with autoplay attempt) ====== */
function initMusicStar() {
  const audio = document.getElementById('bg-music');
  const star = document.getElementById('music-star');
  const headerBtn = document.querySelector('.audio-toggle');

  if (!audio || !star) return;

  // helper to update visual state
  function setStarState({ playing = false, audible = false, autoplayMuted = false } = {}) {
    star.classList.toggle('playing', playing && audible);
    star.classList.toggle('muted', playing && !audible);
    star.classList.toggle('autoplay-muted', autoplayMuted && !audible && playing);
    star.setAttribute('aria-pressed', String(playing));
    // sync header button label
    if (headerBtn) headerBtn.textContent = (playing && audible) ? 'Pause ♫' : 'Play ♫';
  }

  // Try to autoplay. Browsers commonly allow muted autoplay but block unmuted autoplay.
  (async function tryAutoplay() {
    try {
      audio.muted = true;
      await audio.play(); // muted autoplay attempt
      // Attempt to unmute and play audible - this may be blocked in some browsers.
      try {
        audio.muted = false;
        await audio.play();
        // audible autoplay succeeded
        setStarState({ playing: true, audible: true, autoplayMuted: false });
      } catch (unmuteErr) {
        // audible blocked; keep playing muted and show a muted-autoplay indicator
        audio.muted = true;
        setStarState({ playing: true, audible: false, autoplayMuted: true });
      }
    } catch (err) {
      // muted autoplay failed too (rare on modern browsers) — leave paused
      audio.pause();
      audio.muted = true;
      setStarState({ playing: false, audible: false, autoplayMuted: false });
      console.warn('Autoplay failed or blocked:', err);
    }
  })();

  // Clicking the star is a clear user gesture: unmute & play or toggle pause
  star.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      if (audio.paused) {
        // if currently muted, unmute first (user gesture)
        if (audio.muted) audio.muted = false;
        await audio.play();
        setStarState({ playing: true, audible: !audio.muted, autoplayMuted: false });
      } else {
        // audio playing — toggle pause
        audio.pause();
        setStarState({ playing: false, audible: false, autoplayMuted: false });
      }
    } catch (err) {
      // if play fails, keep audio muted and ask user to try again
      console.warn('Play/pause toggling failed:', err);
      // If unmute blocked, try to at least play muted
      try { audio.muted = true; await audio.play(); setStarState({ playing: true, audible: false, autoplayMuted: true }); } catch(e2){ /* ignore */ }
    }
    // also sync header button label
    if (headerBtn) headerBtn.setAttribute('aria-pressed', String(!audio.paused && !audio.muted));
  });

  // Keyboard accessibility: Enter/Space toggles too
  star.addEventListener('keypress', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') star.click(); });

  // Keep the star visual in sync if other controls change audio
  audio.addEventListener('play', () => setStarState({ playing: true, audible: !audio.muted, autoplayMuted: audio.muted }));
  audio.addEventListener('pause', () => setStarState({ playing: false, audible: false, autoplayMuted: false }));
  audio.addEventListener('volumechange', () => setStarState({ playing: !audio.paused, audible: !audio.muted, autoplayMuted: audio.muted }));

  // Ensure header button text follows actual state
  audio.addEventListener('play', () => { if (headerBtn) headerBtn.textContent = audio.muted ? 'Play ♫' : 'Pause ♫'; });
  audio.addEventListener('pause', () => { if (headerBtn) headerBtn.textContent = 'Play ♫'; });
}

/* ====== FLOATING HEARTS ====== */
function spawnHearts() {
  const container = document.getElementById('hearts');

  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.style.position = 'absolute';
    const size = (Math.random() * 18) + 8;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-20px';
    heart.style.opacity = Math.random() * .9 + .2;
    heart.style.transform = `translateX(${(Math.random() - 0.5) * 20}px) rotate(${Math.random()*30-15}deg)`;
    heart.style.pointerEvents = 'none';
    heart.innerHTML = '<svg viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg" fill="#e6c3ff" style="width:100%;height:100%"><path d="M23.6 0c-2.8 0-5 1.5-6 3.6C16.4 1.5 14.2 0 11.4 0 5 0 0 4.6 0 10.4 0 18.5 16 29 16 29s16-10.5 16-18.6C32 4.6 27 0 23.6 0z"/></svg>';
    container.appendChild(heart);

    const duration = (Math.random() * 7) + 6;
    heart.animate([
      { transform: heart.style.transform + ' translateY(0px)', opacity: heart.style.opacity },
      { transform: heart.style.transform + ` translateY(-${window.innerHeight + 100}px)`, opacity: 0.02 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(.2,.9,.2,1)',
      iterations: 1
    }).onfinish = () => heart.remove();
  }

  // spawn intermittently
  setInterval(createHeart, 800);
  // initial hearts
  for (let i=0;i<6;i++) setTimeout(createHeart, i*300);
}

/* ====== Accessibility: ensure there's a progress element for story progress bar <i> child exists ====== */
document.addEventListener('DOMContentLoaded', () => {
  const sp = document.getElementById('story-progress');
  if (sp && !sp.querySelector('i')) {
    const i = document.createElement('i');
    i.style.width = '0%';
    sp.appendChild(i);
  }
});
