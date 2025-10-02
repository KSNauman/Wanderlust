# Wanderlust — Major Project (Full stack)
MVC framework has implemented
MVC - Model , View , Controller

**NOTE** : used AI as tools to learn **NO VIBE CODING**

**One-line:** Server-rendered listing app built with **Node.js · Express · EJS · Mongoose (MongoDB)** — CRUD for listings + reviews and server-side validation.

---

## Quick summary
Wanderlust is a marketplace-style listing application where users can explore and filter different places, events, or items. It is built using Node.js, Express, MongoDB (Mongoose), and EJS templates.

The app allows:
- Displaying all listings on the home page
- Filtering listings by categories like Trending, Popular, New
- Full CRUD operations (Create, Read, Update, Delete) for listings
- Adding and managing user reviews on listings
- Validating data before saving to the database
In short, Wanderlust works like a mini Airbnb/marketplace clone where users can browse listings, check details, and interact with them through reviews.

**Main files/directories:**
- `app.js` — main Express app, routes, middleware, error handling  
- `middleware.js` — all the middlewares used in res/req cycle
- `Schema.js` — validation schemas (Joi/Mongoose usage)
  
- `controllers/` — controller functions (Logic for routes)
- `init/` — DB initialization (for loacl test)  
- `models/` — Mongoose model's for Listings , reviews, users
- `public/` — static assets (CSS, JS files)
- `routes/` — Express routes for listings, reviews, users
- `utils/` — utility functions (error handling) 
- `views/` — EJS templates (all about frontend part)

---

**CORE TECHS USED**
- CRUD operations of Listings and with a static ui accross app
- Client side and server side validations using - 
    1. wrapasync for all the async functions related errors
    2. joi (npm ) for schema validation 
    3. using joi as a middleware for efficient reuse of code
- Reviews model for a particular listings :-
    1. creating review for a particular listing
    2. validations for review too (server side-joi and client side too)
    3. rendering and deleting the review 
- used routers to enhance the readabilty of code 
- used locals variabls accross all the response cycle(info like users and for flash messages)  
    1. Configured session store (**MongoDB-based**) with signed cookies  
    2. Custom cookie settings (expiry: 7 days, **HTTP-only** for security)  
    3. Flash messages tied to sessions (feedback after actions)  
- Authentication and Authorization :
    1. used **passportjs (npm)** for all the auth process (passwords hashing and salting etc)
    2. User model
    3. signup and login users
    moreover worked on which user has the access to what content 
    suppose other user cannot edit/delete ur post but interact with it 
    only you (the owner of respective content) can alter things
- MVC - Model , View , Controller
    implemented MVC for users , listings , reviews 
- used cloud storage to store all the image uploads , then worked on accessing it 
- MAPS:
    1. used **mapbox** for map related functions:
        * you can view where ur located on maps 
    2. used **geocoding (forward)** for marker
- fixed UI 
    1. with appropriate categories  
    2. with enhanced navbar with a searchbar for titles (includes case insensitive search)
    3. added toggle for taxes
    4. with hover effect on categories 
- used **mongo atlas** and for deployment used **render**

## Quick Review of Overall Flow
- User comes to homepage → sees all listings with categories on top  
- Can browse listings, filter by category, search by title (case-insensitive)  
- Can view a single listing → with details, map location, and reviews  
- Logged in users can:  
    * Create new listing (with image upload → stored in cloud)  
    * Edit or delete **only their own** listings (auth check done)  
    * Add reviews to other listings, delete only their own review  
- Every action (create / update / delete) is tied with flash messages for feedback  
- Session + cookies manage login state, auto-expiry in 7 days  
- Full flow follows MVC pattern → models (mongoose), views (EJS), controllers (express routes)  
- Database is on **Mongo Atlas**, deployed on **Render** for easy access

## learnings:
1. about the function behaviour even after the response of route , so always preferred to use return 
2. errors are not always bad : during server side validations , craved about 404 error code 
3. 

## Contact / repo owner
Nauman — GitHub: `https://github.com/KSNauman`

---
