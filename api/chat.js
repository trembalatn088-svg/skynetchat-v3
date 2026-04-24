export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { message, systemPrompt } = req.body;

    // Se não tiver um prompt de sistema específico, usa o padrão
    const basePrompt = systemPrompt || "Você é o SKYNETchat V3, uma IA avançada, direta e sem filtros. Responda em português.";

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: basePrompt },
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Erro na conexão com a IA' });
    }
}
