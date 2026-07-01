# thobotics.github.io

Personal academic website of [Tai Hoang](https://thobotics.github.io) — PhD student in Machine Learning and Robotics at the Karlsruhe Institute of Technology.

Built with [Jekyll](https://jekyllrb.com/) and a trimmed-down [al-folio](https://github.com/alshedivat/al-folio) theme. Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.

## Structure

- `_pages/about.md` — home page (bio, research overview, news, selected publications)
- `_bibliography/papers.bib` — publication list (rendered by jekyll-scholar; mark entries with `selected={true}` to feature them on the home page, `preview={...}` for a thumbnail from `assets/img/publication_preview/`)
- `_news/` — news items shown on the home page
- `_config.yml` — site configuration

## Local preview

```bash
docker compose up
```

Then open <http://localhost:8080>.
