# Wanderlust — Major Project (Phase 2)

**One-line:** Server-rendered listing app built with **Node.js · Express · EJS · Mongoose (MongoDB)** — CRUD for listings + reviews and server-side validation.

---

## Quick summary
Wanderlust is a marketplace/listing app. Phase 2 implements server-side logic, CRUD operations and review functionality using Express and MongoDB (Mongoose). The app uses EJS templates for views and has validation utilities.

**Primary features implemented in this phase**
- CRUD for `Listing` resources (create, read, update, delete).  
- Reviews endpoint: `POST /listing/:id/reviews`.  
- Server-side rendering using EJS templates (`views/`).  
- Mongoose schema(s) and Joi usage for validation.  
- Error handling utilities (`utils/wrapAsync.js`, `utils/ExpressError.js`).

**Main files**
- `app.js` — main Express app, routes, middleware, error handling  
- `init/index.js` — DB initialization (currently local)  
- `Schema.js` — validation schemas (Joi/Mongoose usage)  
- `models/listing.js` — Mongoose `Listing` model  
- `views/` — EJS templates (index, new, show, edit)  
- `utils/` — `wrapAsync.js`, `ExpressError.js`  

---

## Current status (short)
- **Backend / server & routes:** ✔ largely implemented  
- **DB:** local MongoDB configured; will move to Atlas for deployment  
- **Frontend (EJS):** Basic templates exist; styling/polish in progress  
- **Auth:** Not implemented yet (in progress)  
- **Deployment:** Not deployed (local-only for now)  
- **Docs / demo:** README added; Postman & demo video pending

**Progress note:** Development ongoing — frontend polishing, auth, tests, and deployment pending (ETA ~10–15 days).

---

## Run locally (step-by-step)

1. Clone & open project
```
git clone <repo-url>
cd MAJORPROJECT
```

2. Install dependencies
```
npm install
```

3. need mongodb installed and its in hardcoded databases
(modify this to atlas or others when the project is done )

5. Open in browser:
```
http://localhost:8080
```


## Key endpoints (server-rendered & API)
- `GET /` — homepage  
- `GET /listing` — list all listings  
- `GET /listing/new` — new listing form  
- `POST /listing` — create listing  
- `GET /listing/:id` — show single listing  
- `GET /listing/:id/edit` — edit form  
- `PUT /listing/:id` — update listing  
- `DELETE /listing/:id` — delete listing  
- `POST /listing/:id/reviews` — add review to listing


## What to look at (for quick review)
- `app.js` — routes, middleware, error handlers  
- `models/listing.js` & `Schema.js` — schema design, validations  
- `views/` — EJS templates for flows (index, show, new, edit)  
- `utils/` — `wrapAsync.js`, `ExpressError.js` (see how async errors are handled)

---

## TODO / Next priorities (progress pending)
1. 
---


## Contact / repo owner
Nauman — GitHub: `https://github.com/KSNauman`

---

**Progress: BACKEND largely implemented; FRONTEND polish, AUTH, TESTS and DEPLOYMENT are still pending (ETA ~10–15 days).**

views - view engine uses views folder to look up the ejs templates
- includes : folder to store the repeted parts of ui like navbar 
- error : folder to display the error 
- layouts : folder to store the boilerplate
- listings : folder to store all the listings ejs
- users : folder to store all the users ejs 
public - public folder is used by express , it uses this folder to serve the static files 
