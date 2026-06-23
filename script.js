const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navMenu.addEventListener('click', event => {
    if (event.target.matches('a')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const rssFeedUrl = 'https://media.rss.com/salt-sovereignty/feed.xml';
const featured = document.querySelector('[data-featured-episode]');
const episodeList = document.querySelector('[data-episode-list]');

function stripHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function episodeLink(item) {
  return item.querySelector('link')?.textContent?.trim() || rssFeedUrl;
}

async function loadPodcastFeed() {
  if (!featured || !episodeList) return;

  const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssFeedUrl)}`;

  try {
    const response = await fetch(proxiedUrl);
    if (!response.ok) throw new Error('Feed request failed');
    const xmlText = await response.text();
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0, 4);
    if (!items.length) throw new Error('No episodes found');

    const latest = items[0];
    const latestTitle = latest.querySelector('title')?.textContent?.trim() || 'Latest Episode';
    const latestDate = formatDate(latest.querySelector('pubDate')?.textContent);
    const latestSummary = stripHtml(latest.querySelector('description')?.textContent || '').slice(0, 230);
    const latestLink = episodeLink(latest);

    featured.innerHTML = `
      <p class="eyebrow">Latest Episode</p>
      <h3>${latestTitle}</h3>
      ${latestDate ? `<p><strong>${latestDate}</strong></p>` : ''}
      <p>${latestSummary}${latestSummary.length >= 230 ? '...' : ''}</p>
      <a class="btn btn-primary" href="${latestLink}" target="_blank" rel="noopener">Listen to This Episode</a>
    `;

    episodeList.innerHTML = items.slice(1).map(item => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Salt & Sovereignty Episode';
      const date = formatDate(item.querySelector('pubDate')?.textContent);
      const summary = stripHtml(item.querySelector('description')?.textContent || '').slice(0, 140);
      const link = episodeLink(item);
      return `
        <article class="episode-card">
          ${date ? `<time>${date}</time>` : ''}
          <h3>${title}</h3>
          <p>${summary}${summary.length >= 140 ? '...' : ''}</p>
          <a href="${link}" target="_blank" rel="noopener">Listen</a>
        </article>
      `;
    }).join('');
  } catch (error) {
    console.warn('Podcast feed could not be loaded. Keeping sample episode cards.', error);
  }
}

loadPodcastFeed();
