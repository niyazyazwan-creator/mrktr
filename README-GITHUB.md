# MRKTR V55 — GitHub / Netlify deployment

This is a static website. Upload **the contents of this folder** to the **root** of your GitHub repository (`index.html` at root).

### GitHub Pages
Go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/ (root)`. The `.nojekyll` file prevents unexpected Jekyll processing. The site uses relative paths for images, CSS, and JS.

### Netlify connected to GitHub
In Netlify, select **Add new project → Import an existing project → GitHub**. Choose the repository. Set **Build command** blank and **Publish directory** to `.` (repository root). Deploy.

### Enquiry form — important
Netlify Forms only receives automatic submissions on a Netlify-hosted domain, if form detection is enabled and notifications are configured. Set notification email to `niyazyazwan@gmail.com` in Netlify. When hosted directly on GitHub Pages, this version opens a prepared email instead of submitting automatically. For a custom Netlify domain, configure the site's form handler detection accordingly.

### Performance
V55 replaced the large 2.8 MB homepage PNG with a full-resolution high-quality WebP (~390 KB) and a separate mobile WebP (~70 KB). Loading screen delay removed; mobile portrait is recomposed without altering the face. No bundler or dependencies need installing.
