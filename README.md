# BAI

BAI is a Node.js and Express web application for connecting users with local maids for household services such as cleaning, cooking, laundry, and dish washing.

This project supports two roles:
- `User`: can sign up, log in, browse maids, create bookings, cancel bookings, and leave reviews
- `Maid`: can sign up, log in, view booking requests, and update booking status

## Features

- User and maid authentication with `passport` and `passport-local-mongoose`
- Service-based maid discovery
- Optional location-based nearby maid filtering using browser geolocation
- Booking flow with future date-time validation
- Maid-side booking management
- Review and rating system for maids
- Flash messages for success and error feedback

## Services Available

- Cleaning
- Cooking
- Laundry
- Dish Washing

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Passport.js
- Express Session
- Connect Flash

## Project Structure

```text
BAI/
├── app.js
├── config/
├── database/
├── models/
├── public/
├── routes/
├── test/
├── utils/
├── views/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the project root.

Use [.env.example](C:/Users/Pragati%20Prajapati/Desktop/BAI/.env.example:1) as a reference:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/BAI
SESSION_SECRET=your_long_random_session_secret
```

What these do:
- `PORT`: port used by the Express server
- `MONGO_URL`: MongoDB connection string
- `SESSION_SECRET`: secret used for session signing

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
```

2. Move into the project folder
```bash
cd BAI
```

3. Install dependencies
```bash
npm install
```

4. Create your `.env` file
```bash
copy .env.example .env
```

5. Update `.env` with your own values

## Run The Project

Start normally:

```bash
npm start
```

Start in development mode with auto-reload:

```bash
npm run dev
```

## Running Tests

This project includes a lightweight test script for core business logic and middleware.

Run:

```bash
npm test
```

Current tests cover:
- booking date-time parsing
- invalid booking date-time handling
- `isUser` middleware behavior
- `isMaid` middleware behavior

## Database Seed Scripts

This project contains sample seed files in `database/initdata/`.

Run user seed data:

```bash
node database/initdata/inituser.js
```

Run maid seed data:

```bash
node database/initdata/initmaid.js
```

Make sure your `.env` is configured before running these scripts.

## Main Application Flow

### User Flow

1. User signs up or logs in
2. User chooses a service from the home page
3. User can add more services on the addon page
4. App optionally uses geolocation to find nearby maids
5. User selects a maid from the maid list
6. User chooses services, date, and time
7. Booking is created only if the selected date-time is in the future
8. User can view and cancel bookings from `My Bookings`

### Maid Flow

1. Maid signs up or logs in
2. Maid visits the maid dashboard
3. Maid views booking requests in the calendar page
4. Maid can accept, reject, or complete bookings

## Important Notes

- `.env` is ignored by Git and should never be pushed
- `node_modules/` is ignored by Git
- Use `.env.example` for sharing required config safely
- Booking date-time validation is enforced on both frontend and backend

## Key Files

- [app.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/app.js:1): app setup, DB connection, session config, route mounting
- [routes/auth.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/routes/auth.js:1): user and maid authentication
- [routes/pages.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/routes/pages.js:1): home, addon, and maid listing pages
- [routes/bookings.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/routes/bookings.js:1): booking creation, cancellation, and review actions
- [routes/maid.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/routes/maid.js:1): maid dashboard and booking status updates
- [middleware.js](C:/Users/Pragati%20Prajapati/Desktop/BAI/middleware.js:1): role-based route protection

## Future Improvements

- add route and integration tests
- add better validation for forms and schemas
- store booking date and time as a single `Date` field
- improve deployment readiness with production session cookie settings
- add screenshots to this README

## Author

Pragati Prajapati
