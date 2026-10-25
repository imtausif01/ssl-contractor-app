# SSL Contractor Website (Installable PWA)

A beginner-friendly, responsive one-page construction business website with premium black-and-gold styling.

## Features

- Responsive desktop, tablet and mobile layouts
- Custom SSL SVG logo
- Sticky header and mobile navigation drawer
- Hover effects and scroll-reveal animation
- Services, about, gallery, process and contact sections
- Gallery filters and accessible image viewer
- Phone and WhatsApp contact buttons
- Contact form that prepares a WhatsApp message
- Instagram and Facebook URL placeholders
- SEO title, meta description, Open Graph basics and image alt text
- PWA manifest, app icons and service worker for app-like installation and shell caching
- Beginner-friendly comments in HTML, CSS and JavaScript

## Folder structure

```text
ssl-contractor-app/
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
├── css/style.css
├── js/script.js
├── images/ssl-logo.svg
├── images/projects/
│   ├── new-construction.webp
│   ├── renovation.webp
│   ├── brickwork.webp
│   ├── material-work.webp
│   ├── about-house.webp
│   ├── gallery-home.webp
│   ├── gallery-construction.webp
│   ├── gallery-brickwork.webp
│   ├── gallery-interior.webp
│   └── gallery-site.webp
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## 1. Run locally

1. Extract the ZIP.
2. Open the folder in Visual Studio Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Test navigation, filters, gallery, phone links and the WhatsApp form.

Opening `index.html` directly works for basic preview, but the service worker and PWA installation need `localhost` or HTTPS.

## 2. Install it like an app

This is a Progressive Web App (PWA), not a native APK or Play Store app.

1. Upload the website to a static host that supports HTTPS.
2. Open the live URL in Chrome on Android.
3. Open Chrome's menu and choose **Install app** or **Add to Home screen** (wording varies by browser).
4. Confirm installation. The website can open in a standalone, app-like window.

Desktop Chrome/Edge may show an install icon in the address bar or an install option in the browser menu.

PWA installation depends on browser support. The service worker caches the local app shell, but remote sample images and Google Fonts are not guaranteed to be available offline. Change `CACHE_NAME` in `sw.js` after significant releases to refresh the cache.

## 3. Replace the sample images

The project folder has image paths ready for your own photos. Until local photos are added, the site uses remote Unsplash fallback images when online.

1. Put your chosen photo inside `images/projects/`.
2. Use a short filename such as `new-construction.webp`.
3. Use WebP or AVIF where possible. Aim for about 900–1400 px wide for these layouts and compress images without making them visibly blurry.
4. Keep the same filename as the existing `src`, or change the `src` path in `index.html`.
5. Replace sample gallery captions and alt text with accurate descriptions of the actual photo.

### Change the large hero image

In `css/style.css`, find `.hero-photo` and replace the external image URL with a local image:

```css
background: url("../images/projects/hero-house.webp") center 52% / cover no-repeat;
```

Then put `hero-house.webp` in `images/projects/`.

## 4. Add Instagram and Facebook

Open `js/script.js` and find the social profile section near the bottom. Replace the empty strings with your official profile URLs:

```js
const INSTAGRAM_URL = "https://www.instagram.com/YOUR_USERNAME/";
const FACEBOOK_URL = "https://www.facebook.com/YOUR_PAGE/";
```

Do not publish placeholder or fake profile links.

## 5. Change the phone number and service area

Search in `index.html` and `js/script.js` for `9855306181` and update every occurrence if the official business number changes. WhatsApp uses the international number without spaces or plus signs in the `wa.me` URL. Confirm that the number is registered on WhatsApp.

Update the service area and service descriptions to match the real business.

## 6. Publish the website

Any static hosting service with HTTPS can host the project.

1. Upload the **contents** of this folder to the hosting root (often `public_html`).
2. Ensure `index.html` is directly in that root, not inside an extra nested folder.
3. Enable HTTPS.
4. Open the live URL on mobile and desktop.
5. Test contact links, form, social links, gallery and PWA installation.

A custom domain is optional. PWA installation requires HTTPS in production.

## 7. SEO checklist

- Keep the page title and meta description accurate.
- Use genuine project photos and truthful alt text.
- Add the official Instagram and Facebook links.
- Consider a verified Google Business Profile.
- Add a canonical URL and structured business data after the final domain and verified business details are known.
- Never invent reviews, ratings, addresses, awards or certifications.

## 8. Test checklist

- [ ] All navigation links point to existing sections.
- [ ] Mobile menu opens/closes and updates `aria-expanded`.
- [ ] Gallery filters work and update `aria-pressed`.
- [ ] Gallery opens, closes and moves between images.
- [ ] Escape closes the gallery viewer.
- [ ] Phone links open the dialler on supported devices.
- [ ] WhatsApp buttons open the intended chat.
- [ ] Form validates required fields and prepares a WhatsApp message.
- [ ] Instagram and Facebook URLs are set before launch.
- [ ] Replace all sample imagery before presenting the gallery as actual company work.
- [ ] Test narrow mobile and desktop widths.
- [ ] Test HTTPS and app installation on the deployed website.

This is a static front-end project. It has no database, login system, payment processing or server-side form storage.
