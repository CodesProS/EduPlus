import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { staffCount, observationsCount, reviewsCount, goalsCount, onTrack, atRisk, completed, avgScore, recentReviews } = await req.json()

  const reviewSummary = recentReviews.length > 0
    ? recentReviews.map(r => `${r.teacher} (${r.dept}): ${r.overall}%`).join(', ')
    : 'No reviews yet'

  const prompt = `You are an expert K-12 school analytics advisor. Based on the following school performance data, provide exactly 3 concise, actionable insights for the principal. Each insight should be one sentence. Be specific and data-driven.

Current Data:
- Staff Members: ${staffCount}
- Total Classroom Observations: ${observationsCount}
- Performance Reviews Completed: ${reviewsCount}
- Goals: ${onTrack} On Track, ${atRisk} At Risk, ${completed} Completed
- Average Review Score: ${avgScore}%
- Recent Reviews: ${reviewSummary}

Format your response as exactly 3 insights, each on its own line, starting with a relevant emoji. No headers, no numbering, no extra explanation — just the 3 insight lines.`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 250,
  })

  const text = completion.choices[0]?.message?.content || ''
  const insights = text.split('\n').filter(line => line.trim().length > 0).slice(0, 3)
  return NextResponse.json({ insights })
}
