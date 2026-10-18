# Event Nest

Event Nest is an event management app for Web Programming Assignment 2. It was prepared for roll number **L230695**. Visitors can browse upcoming Ticketmaster events, search by name and city, filter by category, and open event details. A signed-in visitor can register for an event and manage it in My Events.

## Technologies

- React and Vite
- Redux Toolkit and React Redux
- React Router
- Ticketmaster Discovery API v2
- Browser localStorage for the assignment's simulated accounts and registrations

## Setup

1. Install Node.js 20.19 or newer.
2. Run `npm install` in this folder.
3. Create a Ticketmaster developer account at https://developer.ticketmaster.com/ and copy its Consumer Key.
4. Copy `.env.example` to `.env` and replace the placeholder with your Consumer Key.
5. Run `npm run dev` and open the local URL shown in the terminal.

Example `.env` file:

```text
VITE_TICKETMASTER_API_KEY=your_consumer_key_here
```

The app shows a clear message when the key is missing or invalid. A key is required to load live events.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist` |
| `npm run preview` | Preview the production build |
| `npm test` | Run account and registration logic tests |

## Pages and features

| Route | What it does |
| --- | --- |
| `/events` | Search upcoming events, filter categories and city, and move between pages |
| `/events/:id` | Show date, venue, location, category, image, extra details, and registration controls |
| `/register` | Create a local account with name, email, and password validation |
| `/login` | Log in to a local account |
| `/my-events` | See upcoming and completed registrations and cancel upcoming ones |

Accounts and event registrations stay in localStorage after refresh. Registrations are stored separately for each account. The same account cannot register twice for one event. Logging out protects the My Events page.

## Assignment scope

Registration in Event Nest is a local assignment simulation. It does not buy tickets or register anyone with Ticketmaster. Account data is stored only in the current browser. Passwords are stored as salted SHA-256 hashes for the exercise, but this frontend design is not a real authentication system. A production app needs server-side authentication and a server proxy for its Ticketmaster key.

The `.env` file is ignored by Git, so the key is not committed. Vite includes `VITE_` variables in browser code, which means visitors can still see a key used by a deployed frontend. Do not treat it as a secret in production.

AI tools assisted with planning, implementation, debugging, and review. The source was checked with a production build, logic tests, and browser interaction. Any further disclosure should follow the instructor's academic integrity policy.
