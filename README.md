# Event Nest

Event Nest is a React event management app for Web Programming Assignment 2. It uses Redux Toolkit, React Router, and the Ticketmaster Discovery API.

## Setup

1. Install Node.js 20.19 or newer.
2. Run `pnpm install` in this folder.
3. Copy `.env.example` to `.env` and replace the placeholder with a Ticketmaster Consumer Key.
4. Run `pnpm dev` and open the local URL shown in the terminal.

## Commands

- `pnpm dev` starts the development server.
- `pnpm build` creates the production build.
- `pnpm preview` previews that build.
- `pnpm test` runs the small logic tests.

The Ticketmaster key is read from `VITE_TICKETMASTER_API_KEY`. The `.env` file is ignored by Git. This is a frontend assignment, so a key used in the browser is visible to visitors; a production app should call Ticketmaster through a server.
