# ELEGANCE CITY — Static Storefront (EN + DE + AR)

- Theme: Yellow & Black
- Languages: English, Deutsch, العربية
- Payment: PayPal only
- Discount password: `ELEGANCE40` for **40% off**
- The hero logo is an `<img>` for guaranteed visibility.
- Every product card has a **logo watermark** (bottom-right, with subtle glow).
- The whole page has a **large watermark background** using the logo.

## Deploy
1. Put your PayPal Client ID into `index.html` (replace `YOUR_PAYPAL_CLIENT_ID`).
2. Upload everything to GitHub (Pages) or any static host.
3. Make sure `assets/logo.jpeg` exists and matches the filename exactly.
4. Optional: Replace placeholder product thumbnails later; watermark stays automatically.

## File Overview
- `index.html` – layout & structure, favicon links
- `styles.css` – theme, background watermark, logo glow on products
- `main.js` – products rendering, i18n, discount logic, PayPal button rendering
- `products.json` – product catalog (EN/DE/AR names & categories)
- `assets/logo.jpeg` – main logo (used everywhere)
- `assets/favicon.ico` – tab icon (generated from logo)
- `assets/512.png` – optional app icon

## Notes
- Arabic layout toggles RTL automatically.
- Discount label appears when the password is unlocked.