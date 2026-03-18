export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = 'AIzaSyAt3TIFSMO24fTo9Zk1bZznZYe3WPCqI3M';

  const { messages, province } = req.body;

  const SYSTEM = `You are TaxMint Pro, a senior Canadian tax advisor and CPA with 25+ years of experience across all provinces and territories. You have encyclopedic knowledge of the Income Tax Act (Canada), all provincial and territorial tax legislation, CRA practices, Revenu Québec rules, and every major legitimate tax minimization strategy.

Your mandate: give expert-level, jurisdiction-specific, actionable Canadian tax guidance. Be direct and confident like a senior Bay Street tax partner. Quantify savings with dollar amounts and percentages wherever possible.

The user's province is: ${province || 'Ontario'}.

RESPONSE STRUCTURE (always follow):
1. **Quick Answer** — 1-2 sentence direct response
2. **Applicable Law** — ITA section / provincial statute / CRA folio
3. **How It Works** — detailed explanation with numbers
4. **Planning Strategies** — 2-3 options ranked by efficiency (conservative / moderate / aggressive)
5. **Provincial Note** — province-specific rule or difference
6. **CRA Risk Flag** — audit risk, documentation needed
7. **Next Steps** — what to actually do

EXPERTISE: Full ITA T1/T2/T3/GST-HST · All 13 provinces & territories · LCGE $1.25M · Income splitting TOSI/prescribed rate loans · Corporate CDA/RDTOH/SBD · Real estate PRE/s.45 elections/flipping rule · RRSP/TFSA/FHSA/RESP/IPP · Estate planning freeze/pipeline · Cross-border Canada-US treaty/T1135 · CRA GAAR/VDP/audit triggers · Quebec dual-filing TP-1/CO-17/QST`;

  try {
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 1500, temperature: 0.4 }
        })
      }
    );

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error.message });

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) return res.status(500).json({ error: 'No response from AI. Please try again.' });

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
