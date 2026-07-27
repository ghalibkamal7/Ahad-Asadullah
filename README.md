# Ahad Asadullah — Study Material Platform

A premium, production-ready platform for **selling study material** — courses, PDF-based test series, video lectures (YouTube), notes, previous year papers, practice sets and current affairs. No online exam engine: every test series and practice set is a downloadable/viewable PDF, with no timer, auto-submit, question palette, negative marking, rank, leaderboard, or result analysis anywhere in the product.

Built with React, Vite, Tailwind CSS, Firebase (Auth + Firestore + Storage) and Razorpay. All content is Firestore/Storage-backed — there is no local mock data file.

## Tech Stack

- **React 18 + Vite**
- **Tailwind CSS** — royal blue + jade glassmorphism theme
- **Firebase Authentication** — email/password + Google
- **Firebase Firestore** — every content type lives in its own collection
- **Firebase Storage** — PDFs and thumbnails
- **Razorpay** — checkout with optional coupon codes (admin sets flat ₹ or % discount)
- **Framer Motion** — page transitions and micro-interactions
- **Recharts** — admin analytics, computed live from Firestore

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your Firebase + Razorpay keys
npm run dev
```

## Push to GitHub (ghalibkamal7/Ahad-Asadullah)

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit — Ahad Asadullah study material platform"
git branch -M main
git remote add origin https://github.com/ghalibkamal7/Ahad-Asadullah.git
git push -u origin main
```

If the repo already has commits (e.g. a README created on GitHub), pull first:

```bash
git pull origin main --allow-unrelated-histories
# resolve any conflicts, then:
git push -u origin main
```

You'll need to be logged into `git` with access to that repo (GitHub CLI `gh auth login`, or a personal access token when prompted for your password).

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** → Email/Password and Google providers.
3. Enable **Firestore Database** and **Storage**.
4. Copy your web app config into `.env`.
5. Deploy the included security rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore storage   # point to firestore.rules / storage.rules in this repo
   firebase deploy --only firestore:rules,storage:rules
   ```
6. Create the first admin: sign up as a normal user, then in the Firestore console edit that user's document under `users/{uid}` and set `role: "admin"`. They'll then see the Admin Panel instead of the Student Dashboard.

### Firestore collections

| Collection | Purpose |
|---|---|
| `users` | Profile, role (`student`/`admin`), purchase arrays |
| `courses` | Paid courses (title, price, thumbnail, description) |
| `testSeries` | PDF-only test series (paperCount, fileUrl) |
| `pdfs` | PDF Library items (free or paid) |
| `videoLectures` | YouTube-linked lectures (youtubeUrl, optional courseId gate) |
| `notes` | Revision notes (PDF) |
| `practiceSets` | Practice papers (PDF) |
| `previousPapers` | Previous year papers (PDF) |
| `currentAffairs` | Current affairs digests (PDF, free) |
| `categories` | Category labels used across the catalog |
| `orders` | One doc per completed Razorpay payment, with `invoiceNumber` |
| `coupons` | `discountType: 'percent' | 'flat'`, `discountValue`, `expiryDate`, `active` |
| `notifications` | Admin-broadcast announcements |

## Razorpay Setup

1. Put your **Key ID** (public) in `VITE_RAZORPAY_KEY_ID`.
2. **Never** put your Key Secret in the frontend. In production, create the Razorpay order server-side (Cloud Function) and verify the payment signature there before trusting a purchase — `src/hooks/useCheckout.js` currently records the order directly from the client after Razorpay's success callback, which is fine to launch with but should move server-side as you scale.

## YouTube Video Lectures

Admins add lectures from **Admin Panel → Upload Video Lectures** by pasting any standard YouTube URL (`watch?v=`, `youtu.be/`, or `/shorts/`). `src/firebase/storage.js` extracts the video ID and `src/components/YouTubePlayer.jsx` embeds it responsively. Lectures can be marked "free preview" or gated behind a `courseId`.

## Project Structure

```
src/
  components/       Reusable UI (Navbar, Footer, cards, BuyModal, Invoice, YouTubePlayer, admin/ResourceManager)
  context/          Theme + Auth React contexts
  firebase/         config.js, firestore.js (CRUD), storage.js (uploads + YouTube helpers)
  hooks/            useCollection, useDocument, useCheckout
  pages/            Public + student pages
  pages/admin/       Every Admin Panel section
```

## Notes for Production

- Move order creation + payment verification to a Cloud Function (see Razorpay section above).
- The Analytics tab aggregates client-side from Firestore for simplicity — replace with scheduled Cloud Function rollups at scale.
- `firestore.rules` and `storage.rules` are included and ready to deploy; review them before going live.
