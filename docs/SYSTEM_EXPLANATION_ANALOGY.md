# SCISP System — Explanation with Analogies

---

## 1. HOW THE INTEGRATION WORKED
### 5 Separate Restaurants → 1 Food Court

Imagine 5 groups each built their own **separate restaurant**:
- Restaurant 1 sells login/registration
- Restaurant 2 sells class schedules
- Restaurant 3 sells announcements
- Restaurant 4 sells library stuff
- Restaurant 5 sells student profiles

Each restaurant had its own kitchen, its own cashier, its own storage room, and its own menu.

**The problem?** If you needed both library AND grades, you'd have to go to two different buildings, log in twice, and carry two receipts.

**What we did** was turn all 5 restaurants into **one food court**:
- One shared kitchen (the database)
- One shared entrance with one security guard (the login system)
- One shared menu app on your phone (the frontend/website)
- Each restaurant still has its own counter and chef (their own code) but they all live under the same roof now

---

## 2. HOW LOGIN & AUTHENTICATION WORKS
### Getting a Wristband at an Event

Think of logging in like arriving at a school fair.

**Step 1 — You show your ID at the gate**
You type your username and password. The guard (server) checks: "Is this person in our list? Is the password correct? Is their account active?"

**Step 2 — The guard gives you a wristband**
If everything checks out, the server gives you a **token** — think of it like a wristband. The wristband has your name, your role (Student/Teacher/Admin), and an expiry time stamped on it.

**Step 3 — You use the wristband to enter different areas**
Every time you click something (view grades, borrow a book, see announcements), your browser secretly shows the wristband to the server behind the scenes. The server checks: "Is this wristband real? Is it still valid? Has it expired?"

**Step 4 — The wristband expires**
After 1 hour, the wristband becomes invalid. You need to log in again. But if you checked "Remember Me," your wristband lasts 30 days.

**Why can't someone fake the wristband?**
Because the wristband is **signed with a secret stamp** that only our server has. Even if someone copies your wristband, they can't make a new one that looks real because they don't have the secret stamp.

---

## 3. HOW ROLE-BASED ACCESS WORKS
### School ID Colors

In some schools, different people have different colored IDs:
- 🔵 **Blue ID = Student** → Can only enter classrooms and the library
- 🟡 **Yellow ID = Teacher** → Can enter classrooms, faculty room, and view student records
- 🔴 **Red ID = Admin/Registrar** → Can enter everything, edit records, approve stuff
- ⚫ **Black ID = Principal/Super Admin** → Master key, can go anywhere

**How it works in our system:**

When you log in, your role is saved on your token. The website reads it and decides what to show you:

- A **Student** sees: their own grades, their own schedule, announcements, library
- A **Teacher** sees: student list, can input grades for their assigned subjects
- An **Admin** sees: everything — can edit student records, approve registrations
- A **Super Admin** sees: the big system dashboard on top of everything admin can do

**Two checkpoints exist:**

🖥️ **Checkpoint 1 — The Website**
The website reads your role and hides buttons and menus you shouldn't see. Like how the student entrance doesn't even have a door to the faculty room.

🔒 **Checkpoint 2 — The Server (THE REAL ONE)**
Even if a sneaky student somehow unhides a button, when they click it, the server checks their ID again. If the server says "you're a student, you can't do this" — it blocks the action. The website check is just for looks; the server check is the real lock.

---

## 4. HOW THE EMAIL CODE (OTP) WORKS
### A Combination Lock with a Timer

Imagine you forgot the key to your locker. Here's what happens:

**Step 1 — You go to the guard and say "I forgot my key"**
You type your username or email in the "Forgot Password" box.

**Step 2 — The guard rolls a dice and writes it on a sticky note**
The server randomly generates a **6-digit code** (e.g., `482719`). It also creates a secret backup code just in case.

**Step 3 — The guard puts the sticky note in your mailbox**
The server sends that 6-digit code to your registered email via Gmail. The email says "your code is 482719, use it within 15 minutes."

**Step 4 — You go back and read the number from your note**
You type the 6-digit code into the website.

**Step 5 — The guard checks two things:**
1. "Is this the same number I wrote?" ✅
2. "Was it written less than 15 minutes ago?" ✅

If both are YES → you're allowed to set a new password.
If it's been more than 15 minutes → the code is expired, request a new one.

**Step 6 — After you reset, the guard throws the sticky note in the trash**
Once your password is reset, the code is **permanently deleted** from the system. Nobody can use it again.

**What if someone tries to guess the code by spamming?**
The system only lets you request the code **5 times in 5 minutes**. After that, it locks you out temporarily.

---

## QUICK SUMMARY

| What | Simple Version |
|------|---------------|
| Integration | 5 separate apps combined into 1, sharing the same database and login |
| Login | You get a signed token (wristband) after login — browser shows it on every action to prove who you are |
| Role Access | Different roles can open different doors, enforced by both the website AND the server |
| Email OTP | Server generates a random 6-digit code, emails it to you, 15 minutes to use it, deleted forever after |
