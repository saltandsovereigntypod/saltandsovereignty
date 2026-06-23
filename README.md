# Salt & Sovereignty Website

A framework-free static website for Salt & Sovereignty, built with HTML, CSS, and JavaScript.

## Files

- `index.html`, main one-page website
- `thank-you.html`, confirmation page for Netlify Forms
- `style.css`, site styling
- `script.js`, mobile navigation, scroll reveals, and podcast RSS loading
- `assets/the-sound-of-your-undoing-cover.png`, featured Book One cover

## Deploy to Netlify through GitHub

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. In Netlify, choose **Add new site** then **Import an existing project**.
4. Connect the GitHub repository.
5. Use these settings:
   - Build command: leave blank
   - Publish directory: `/` or leave as repository root
6. Deploy.

## Contact Form

The contact form uses Netlify Forms. After deployment, Netlify should detect the form named `contact`.

## Podcast Feed

The site attempts to load recent episodes from:

`https://media.rss.com/salt-sovereignty/feed.xml`

Because browser RSS requests can be blocked by CORS, the script uses an AllOrigins proxy. If you prefer not to use a proxy later, connect the RSS feed through a Netlify Function or paste an RSS.com embed directly into the podcast section.
