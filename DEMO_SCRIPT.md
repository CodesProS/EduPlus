# EduPulse Demo Script
**Target length: 2.5–3 minutes**

---

## INTRO (0:00 – 0:15)
*[Dashboard visible on screen]*

"Hi, I'm Soham. This is EduPulse — a K–12 school administration and staff performance platform built with Next.js, Supabase, and Groq AI. Let me walk you through it quickly."

---

## DASHBOARD (0:15 – 0:45)
*[Point to stat cards]*

"The dashboard shows live counts pulled from the database. The bar chart shows real observation and review activity by month."

*[Scroll to AI Insights, click Generate Insights]*

"Clicking Generate Insights sends the live school data to a LLaMA model via Groq and returns data-driven insights. You can see it's referencing the actual numbers."

*[Wait for insights to load]*

---

## OBSERVATIONS + REVIEWS (0:45 – 1:30)
*[Click Observations in sidebar]*

"Admins log classroom visits here. The teacher dropdown pulls from the staff table — selecting a teacher auto-fills their department."

*[Click Performance Reviews in sidebar, click any review]*

"Performance reviews break down scores across Teaching, Communication, and Professionalism. The overall score is auto-calculated."

*[Scroll to AI Coaching Summary, click Generate]*

"The AI Coaching Summary sends the review data to Groq and returns a personalised coaching write-up with strengths and growth recommendations."

*[Wait for it to load — read one line aloud]*

---

## GOALS (1:30 – 2:00)
*[Click Goal Tracking in sidebar]*

"Goal tracking monitors professional development goals per teacher. Progress updates in real time — changes sync to the database instantly."

*[Click New Goal, select a teacher, click AI Suggest]*

"AI Suggest fetches that teacher's past reviews and recommends a SMART development goal targeting their weakest area — auto-fills the field."

---

## CLOSING (2:00 – 2:30)
*[Navigate back to Dashboard]*

"The backend is entirely Next.js API routes — no separate server. Five Supabase tables cover all the data. Three distinct AI touchpoints using Groq. Every core workflow from the brief is covered — observations, reviews, notes, goals, and reporting — plus all five AI features. Thanks for watching."

---

## TIPS
- Don't pause between sections — keep moving
- If AI is loading, say "while that loads..." and keep talking
- Have data in the app before recording so nothing looks empty
