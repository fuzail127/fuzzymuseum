# Portfolio — Syed Fuzail Farhan

Single-page static portfolio. No build step — plain HTML/CSS/JS.

## Structure

- `index.html` — home page: hero, about, experience summaries, project cards
- `experience/*.html` — one detail page per role/design team ("Read more" targets)
- `projects/*.html` — one detail page per project ("Read more" targets)
- `css/style.css` — styles; theme colors live in the `:root` / `[data-theme="dark"]` custom properties at the top
- `js/main.js` — theme toggle, mobile nav, scroll-reveal
- `assets/resume.pdf` — downloadable resume (replace this file when you update your resume)
- `assets/img/` — project photos

To expand on a role or project, edit its page in `experience/` or `projects/` —
each follows the same layout (kicker, title, one-liner, tags, then freeform sections
and optional `<div class="detail-media"><img ...></div>` photo blocks). To add a new
one, copy an existing page and add a summary card/entry with a `read-more` link in
`index.html`.

## Before deploying

- Replace the two `href="#"` GitHub links (search `index.html` for `TODO`) with your GitHub profile URL, or delete them.

## Deploy to GitHub Pages

```bash
cd site
git init
git add .
git commit -m "Portfolio site"
# create a repo named <your-username>.github.io on GitHub, then:
git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
git branch -M main
git push -u origin main
```

Then on GitHub: repo **Settings → Pages → Source: Deploy from a branch → main / (root)**.
The site goes live at `https://<your-username>.github.io` within a minute or two.
