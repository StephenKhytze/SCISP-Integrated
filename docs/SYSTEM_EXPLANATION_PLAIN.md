# SCISP System — Simple Explanation (Plain Language)

---

## 1. HOW THE INTEGRATION WORKED

There were 5 groups, each built their own separate system. Each one had its own login, its own database, and its own website. They couldn't share data with each other because they were completely separate.

To integrate them, we did the following:

- We created **one single database** where all the data lives together — students, faculty, schedules, books, announcements, all in one place.
- We merged all the **backend code** into one Laravel project. Each group's code stayed in its own folder so nothing would conflict.
- We merged all the **frontend pages** into one React website. All pages now share the same sidebar, top bar, and navigation.
- We set up **one login system** that every part of the website uses. You log in once and you can access everything you're allowed to.
- Every API request now goes through one shared service that automatically attaches your login token, so you don't have to log in again every time you switch pages.

---

## 2. HOW LOGIN WORKS

1. You enter your username and password and click Login.
2. The server checks if the username exists in the database.
3. It checks if the password matches what's stored (the password is stored encrypted, not as plain text).
4. It checks if your account is active and not disabled.
5. If everything is correct, the server creates a **token** — a long string of characters that represents you and proves you're logged in.
6. That token is saved in your browser (either localStorage or sessionStorage depending on whether you checked "Remember Me").
7. Every time you do something in the app (open a page, load data, submit a form), your browser sends that token along with the request so the server knows who you are.
8. The token automatically expires after 1 hour. After that, you need to log in again. If you checked "Remember Me," it lasts 30 days.

The token cannot be faked because it is digitally signed using a private key that only the server has.

---

## 3. HOW ROLE-BASED ACCESS WORKS

Every user account has a role saved in the database. The roles are:

- **Student** — can only see their own profile, grades, schedule, announcements, and library
- **Faculty/Teacher** — can see student records and input grades for their assigned subjects
- **Admin** — can do everything: manage students, approve registrations, manage the library
- **Super Admin** — same as Admin plus access to the system-wide dashboard

**How it's enforced:**

On the **website side**, it reads your role and shows or hides certain buttons and menus. A student won't even see the admin controls.

On the **server side**, every action you perform is checked again. Even if someone tampers with the website, when the request reaches the server, it checks your real role from the database. If you don't have permission, the server blocks it and returns an error. The server check is the one that actually matters for security.

---

## 4. HOW THE EMAIL CODE (OTP) WORKS

This is the "Forgot Password" feature. Here's what happens step by step:

1. You enter your username or email address and click Submit.
2. The server finds your account and checks if it has an email address attached.
3. The server randomly generates a **6-digit code** (a random number between 100000 and 999999).
4. It also generates a long random backup token in case you click the reset link in the email instead of typing the code.
5. Both the code and the token are saved in the database along with the current time.
6. The server sends an email to your registered email address containing the 6-digit code and a reset link.
7. You open your email, get the code, and type it into the website.
8. The server checks if the code matches what it saved, and checks if it was generated less than 15 minutes ago.
9. If both are correct, you're allowed to set a new password.
10. Once the password is reset, the code is permanently deleted from the database so it can never be used again.

**Extra protection:**
- If someone tries to request the code too many times (more than 5 times in 5 minutes), the system temporarily blocks that IP address.
- The code expires after 15 minutes no matter what.

---

## QUICK SUMMARY

| What | How It Works |
|------|-------------|
| Integration | All 5 separate systems merged into one — same database, same backend, same frontend, same login |
| Login | Server checks your credentials, gives you a signed token, your browser uses that token for every action |
| Role Access | Your role determines what you can see and do, enforced on both the website and the server |
| Email OTP | Server generates a random 6-digit code, emails it to you, you have 15 minutes to use it, then it's deleted |
