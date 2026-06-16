import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { teacher, dept, reviews } = await req.json()

  const reviewContext = reviews.length > 0
    ? reviews.map(r =>
        `Period: ${r.period} | Teaching: ${r.teaching}% | Communication: ${r.communication}% | Professionalism: ${r.professionalism}% | Overall: ${r.overall}% | Comments: ${r.comments}`
      ).join('\n')
    : 'No prior reviews available.'

  const prompt = `You are a K-12 school administrator writing a professional development goal for a teacher.

Teacher: ${teacher}
Department: ${dept}

Past Performance Reviews:
${reviewContext}

Write a single, specific professional development goal for this teacher based on their performance data. The goal should:
- Target their lowest-scoring area (or general growth if no reviews exist)
- Be achievable within one academic semester
- Follow the SMART format (Specific, Measurable, Achievable, Relevant, Time-bound)
- Be written as one clear sentence

Return only the goal sentence — no preamble, no explanation, no quotation marks.`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 150,
  })

  const goal = completion.choices[0]?.message?.content?.trim() || 'Unable to generate goal suggestion.'
  return NextResponse.json({ goal })
}
