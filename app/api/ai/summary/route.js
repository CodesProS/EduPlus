import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { teacher, dept, period, teaching, communication, professionalism, comments } = await req.json()

  const prompt = `You are an expert K-12 school administrator writing a professional coaching summary for a teacher's performance review.

Teacher: ${teacher}
Department: ${dept}
Review Period: ${period}
Scores (out of 100):
- Teaching Quality: ${teaching}%
- Communication: ${communication}%
- Professionalism: ${professionalism}%
Overall Score: ${Math.round((+teaching + +communication + +professionalism) / 3)}%

Reviewer Comments: ${comments}

Write a concise 3-paragraph coaching summary:
1. Overall assessment of the teacher's performance this period.
2. Key strengths observed based on the scores and comments.
3. One or two specific, actionable recommendations for professional growth.

Keep the tone encouraging, professional, and constructive. Do not use bullet points — write in flowing prose.`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  })

  const summary = completion.choices[0]?.message?.content || 'Unable to generate summary.'
  return NextResponse.json({ summary })
}
