# hacker-news
An alternative frontend to read hackernews. Uses the [public API](https://github.com/HackerNews/API).

## Goals
- PWA
- Dark mode / light mode toggle
- Mobile first, but still looks good on desktop.
- Read-only view of hacker news. Upvoting, commenting, & submitting are not prioritized.


## TODO
- watch and dismiss comment threads.
- react router
    - url for each comment thread


## Ideas
- Autoload new comments
- mark comments as read / unread
- prev, next, and parent buttons / links. (Can these be anchors?)


## Technical Goals
I'm trying some new techniques, to gain experience with them.

- JS Doc instead of Typescript.
    - Still plays nice with editor lsp, but no typechecker to configure.

- Indexed DB.
    - A document db in the browser. Fun!
