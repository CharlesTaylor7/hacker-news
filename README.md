# hacker-news
An alternative frontend to read hackernews. Uses the [public API](https://github.com/HackerNews/API).

## Goals
- PWA
- Dark mode / light mode toggle
- Mobile first, but still looks good on desktop.
- Read-only view of hacker news. Upvoting, commenting, & submitting are not prioritized.

## TODO
- Store content in indexed db.
- render comments with their formatting. i.e. new lines.
- collapsing a comment, minimizes the comment text with ellipsis.
- watch and dismiss comment threads.
- react router
    - url for each comment thread


## Ideas
- Autoload new comments
- Watch / dismiss threads.
- mark comments as read / unread


## Technical Goals
I'm trying some new apis / techniques. Not because I know them to be the best fit, but because I want more experience with them.


- JS Doc instead of Typescript.
    - Still plays nice with editor lsp, but no typechecker to configure

- Indexed DB.
    - A relational db in the browser. Fun!

