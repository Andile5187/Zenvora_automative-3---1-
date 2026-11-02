
## Part 3 features (functionality and SEO)

- **Interactive elements:** accordion on the Services page; modal-style image lightbox on the Showroom page with previous/next and keyboard navigation (Esc, arrow keys).
- **Interactive map:** Leaflet map on the Contact Us page, marking the dealership's address (Cnr Malibongwe Dr & Republic Rd, President Ridge, Randburg, 2194).
- **Animations:** sections fade/slide into view on scroll using `IntersectionObserver` and CSS transitions.
- **Dynamic content:** the Showroom page builds its vehicle cards from a JavaScript data array (`CARS` in `js/script.js`) rather than hard-coded HTML, with a live search box and an availability filter (In Stock / Reserved / Sold).
- **Forms and validation:** both `enquiry.html` and `Contact Us.html` use HTML5 input types plus JavaScript validation (name, email, phone and message-length checks) with inline error messages before submission.
  - `enquiry.html` processes the validated input entirely client-side and displays a response with estimated cost/availability for the chosen service or vehicle.
  - `Contact Us.html` compiles the validated input into an email and hands it to the visitor's email client via a `mailto:` link. The script also includes an optional AJAX (`fetch`) code path that will POST the form as JSON to a real backend/form endpoint (e.g. Formspree) if one is configured in `CONTACT_FORM_ENDPOINT` — see note below.
- **SEO (on-page):** unique `<title>` and meta description/keywords per page, a single `<h1>` per page with `<h2>`/`<h3>` structuring content, descriptive filenames and `alt` text on images, a `<meta name="viewport">` tag for mobile-friendliness, and internal links between all pages via the nav bar and contextual links (e.g. "Send us an enquiry" on the Services page).
- **SEO (technical):** `robots.txt` and `sitemap.xml` added at the site root.
- **Page speed & security basics:** scripts load with `defer`, gallery images use `loading="lazy"`, and a Netlify `_headers` file sets basic security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and cache-control for static assets.

### Register / login

- `register.html` validates name, email, a password (8+ characters, a letter and a number) and a matching confirmation, rejects duplicate emails, then sends the user to `login.html`.
- `login.html` checks the email and password and starts a session; the user is returned to the page they originally asked for.
- `js/auth.js` is loaded in the `<head>` of every page. **Login** and **Sign up** buttons appear in the top right of every page; once signed in they become a greeting and a **Logout** button.
- Every page is open to everyone; logging in is optional. To require an account for particular pages, add their file names (e.g. `"Showroom.html"`) to the `PROTECTED_PAGES` list at the top of `js/auth.js`. Signed-in users who open login/register are sent Home.
- Passwords are salted and hashed (SHA-256) before storage, never saved in plain text.
- **Limitation:** there is no server, so accounts live in the visitor's own browser (`localStorage`). An account made on one device or browser does not exist on another, and a determined visitor can bypass a client-side gate. This is fine for a coursework demo; real security needs a backend (e.g. Firebase Auth, Supabase, or Netlify Identity).

### Known limitations / what still needs manual setup

- **Sending real email:** a static site has no server to send mail from, so `Contact Us.html` opens the visitor's own email app via `mailto:` by default. To send email silently in the background instead, create a free endpoint with a service like [Formspree](https://formspree.io/) and paste its URL into `CONTACT_FORM_ENDPOINT` near the top of `js/script.js`.
- **Off-page SEO** (backlinks, social media promotion, local listings) and **true page-speed/security auditing** (e.g. Lighthouse, a CDN, HTTPS certificates) depend on the live, deployed domain and hosting account, so they can only be finished once the site is deployed.
- **Deployment:** the site is static and deploy-ready, but was not deployed by Claude in this session (no hosting credentials available). See *Deployment* below.
- **Placeholder data:** vehicle names/prices in `js/script.js` (`CARS`) are placeholders replace them with real stock before going live.



**GitHub Pages:**
1. Push this folder to a GitHub repository.
2. In the repository settings, enable **Pages** and point it at the `main` branch (root folder).
3. GitHub gives you a `https://<username>.github.io/<repo>/` URL.

## Changelog

### Part 3 Enhancing Functionality and SEO

- Changed the company address to Cnr Malibongwe Dr & Republic Rd, President Ridge, Randburg, 2194 on the Home and Contact Us pages, the map pin/popup, and the SEO keywords.

- Added register and login: new `register.html` and `login.html` pages, `js/auth.js` (validation, salted SHA-256 password hashing, session handling, duplicate-email check), an optional page gate (off by default), and Login / Sign up / Logout buttons in the top right of every page. Accounts are stored in the browser (`localStorage`) because the site has no backend.

- Added `js/script.js` with: accordion (Services), scroll-reveal animation, dynamic Showroom gallery rendering + search/filter, image lightbox, contact-form validation with `mailto`/AJAX submission, enquiry-form validation with an instant generated response, and a Leaflet interactive map on the Contact Us page.
- Added a new `enquiry.html` page with a form for service, vehicle, or sponsorship/volunteering enquiries, per the Part 1 instructions.
- Added "Enquiry" to the navigation bar on every page.
- Added `<meta name="viewport">`, meta description and meta keywords to every page for SEO and mobile-friendliness.
- Rewrote page `<title>` tags to be descriptive and keyword-rich instead of a single generic word.
- Converted the Showroom page's static vehicle cards into a JavaScript-rendered gallery with search, an availability filter, and status badges (In Stock / Reserved / Sold).
- Converted the Services page's service list into an accordion.
- Added `robots.txt` and `sitemap.xml` for search engine crawling.
- Added a Netlify `_headers` file for basic security headers and cache control.
- Added `loading="lazy"` to gallery images and `defer` to all script tags for page-speed.
- Added this README with project structure, feature list, known limitations and deployment steps.

### Part 3 Improvements to Part 2 (feedback edits)

Edits made to the Part 2 work (CSS and responsive design) when preparing Part 3:

- **Fixed unreadable text:** the page background used `background-attachment: fixed`, which left a white patch of the gradient behind some Showroom cards, so the white vehicle names could not be seen. Removed the fixed attachment so the gradient spans the whole page, and gave the cards a solid dark background (`#141414`) so text always has enough contrast.
- **Fixed mobile display:** added `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to every page. Without it, phones showed a zoomed-out desktop layout and the Part 2 media queries (1024px and 600px) did not apply properly.
- **Improved the Showroom cards:** set `align-items: start` on the gallery grid so cards fit their content instead of stretching to equal height and leaving empty space. Replaced the placeholder "Vehicle 1 / R 000 000" cards with real-looking vehicle names and prices, a status badge (In Stock / Reserved / Sold) and an "Enquire about this vehicle" button.
- **Improved the forms:** labels are now linked to their inputs (`for` / `id`), the `<br>` spacing was replaced with `.field` blocks, and inline error messages were styled. Password and search inputs were added to the form styling so they match the other controls.
- **Improved the responsive layout:** added mobile rules for the new components (the map shrinks to 250px high, the Showroom search bar stacks vertically, the lightbox arrows resize, and the Login / Sign up buttons centre).
- **Improved the navigation:** added the Enquiry page to the menu and the Login / Sign up buttons in the top right of every page.
- **Improved page titles:** replaced generic titles such as "Home page" with descriptive ones such as "Showroom | Zenvora Automative", and added a meta description and keywords to every page.

### Part 2 CSS Styling and Responsive Design

- Created the external stylesheet `css/style.css` and linked it on all pages.
- Added a CSS reset, base typography, Flexbox navigation, and CSS Grid layouts for the contact-details and Showroom sections.
- Added hover/focus/active pseudo-class styling for navigation links, gallery images and form controls.
- Added two responsive breakpoints (1024px, 600px) so the layout adapts for tablet and mobile.
- Fixed HTML errors carried over from Part 1: missing `<body>` tags, a broken logo `<img>` tag, a duplicate nested `<nav>`, and a stray unmatched `</details>` tag.
- Removed inline `style="color:..."` attributes in favour of the external stylesheet.

### Part 1 — Initial Website

- Initial five-page static HTML site (Home, About Us, Services, Showroom, Contact Us) with inline styling.

## References

-  https://developer.mozilla.org/
-  https://leafletjs.com/reference.html
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
