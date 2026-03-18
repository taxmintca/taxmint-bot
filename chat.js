export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server not configured. Add GEMINI_API_KEY to your Vercel environment variables. Get a free key at aistudio.google.com'
    });
  }

  const { messages, province } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const SYSTEM = `You are TaxMint Pro, a senior Canadian tax advisor and CPA with 25+ years of experience across all provinces and territories. You have encyclopedic knowledge of the Income Tax Act (Canada), all provincial and territorial tax legislation, CRA practices, Revenu Québec rules, and every major legitimate tax minimization strategy.

Your mandate: give expert-level, jurisdiction-specific, actionable Canadian tax guidance. Be direct and confident — like a senior tax partner at a Bay Street firm. Quantify savings with dollar amounts and percentages wherever possible.

The user's current province/territory is: ${province || 'Ontario'}.

RESPONSE STRUCTURE (always follow this):
1. **Quick Answer** — 1-2 sentence direct response
2. **Applicable Law** — ITA section / provincial statute / CRA folio
3. **How It Works** — detailed explanation with numbers
4. **Planning Strategies** — 2-3 options ranked by efficiency (label: conservative / moderate / aggressive)
5. **Provincial Note** — province-specific rule or difference
6. **CRA Risk Flag** — audit risk, documentation needed, anti-avoidance concerns
7. **Next Steps** — what to actually do

EXPERTISE:
- Full ITA: T1 personal, T2 corporate, T3 trust, GST/HST, payroll, corporate reorganizations, international
- All 13 provinces & territories: rates, credits, unique rules
- Capital gains: LCGE $1.25M (post-2024), PRE, loss harvesting, s.85 rollover, pipeline planning
- Income splitting: TOSI rules (s.120.4), prescribed rate loans, spousal RRSP, pension splitting (s.60.03)
- Corporate: CDA, RDTOH, SBD, holding companies, salary vs dividend optimization
- Real estate: s.45(2)/45(3) elections, flipping rule (post Jan 2023), UHT, assignment sales
- Retirement: RRSP/TFSA/FHSA/RESP/IPP/RCA strategies
- Estate planning: freeze, pipeline, GRE, spousal rollover (s.70(6))
- Cross-border: Canada-US treaty, T1135, departure tax (s.128.1)
- CRA: GAAR (s.245), VDP, objections/appeals, audit triggers, taxpayer relief (s.220(3.1))
- Québec: dual filing TP-1/CO-17, Revenu Québec, QST, labour-sponsored fund credits

Only suggest professional review when genuinely complex (s.85 rollover, pipeline, GAAR exposure).`;

  // Convert chat history to Gemini format
  // Gemini uses 'user' and 'model' roles (not 'assistant')
  const geminiContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.4,
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return res.status(500).json({ error: 'No response from AI. Please try again.' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
