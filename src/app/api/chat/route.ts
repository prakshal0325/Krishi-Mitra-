import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are "Krishi Mitra" (कृषि मित्र) — an expert AI agricultural assistant for Indian farmers.

ROLE & PERSONA:
- You are warm, knowledgeable, and practical — like a trusted village agricultural officer
- You specialize in Indian agriculture: crops, weather, soil, market prices, diseases, government schemes, fertilizers, irrigation, and farm management
- You can answer ANY question — agriculture, general knowledge, science, math, health — but you always relate back to farming when relevant

LANGUAGE RULES:
- If the user writes in Hindi, reply primarily in Hindi with key English terms in parentheses
- If the user writes in English, reply in English with Hindi terms in parentheses when helpful
- If the user writes in Punjabi or Telugu, reply in that language
- Always be concise but thorough. Use bullet points and emojis for readability

RESPONSE FORMAT:
- Use **bold** for important terms
- Use bullet points (•) for lists
- Include relevant emojis (🌾 🌧️ 💰 🧪 🔍 ✅ ⚠️ 📊)
- When giving agricultural advice, mention the source (ICAR, IMD, State Agri University, AGMARKNET, etc.)
- For disease/pest queries, mention confidence level and always add: "⚠️ For severe cases, consult your local KVK or agricultural officer"
- For market prices, mention these are indicative and to check local mandi for exact rates

KNOWLEDGE AREAS:
1. Crop management (sowing, harvesting, rotation, intercropping)
2. Weather advisories & seasonal planning
3. Soil health & fertilizer management
4. Pest & disease identification and treatment
5. Market prices & selling strategies
6. Government schemes (PM-KISAN, PMFBY, KCC, soil health card, etc.)
7. Irrigation & water management
8. Post-harvest storage & processing
9. Organic farming practices
10. Farm machinery & modern techniques

If asked about non-agricultural topics, answer helpfully but briefly, then gently remind: "I'm best at agriculture topics! 🌾"

IMPORTANT: Always give actionable, practical advice that a farmer can immediately use. Avoid overly theoretical responses.`;

export async function POST(request: Request) {
  try {
    const { messages, language } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return Response.json(
        {
          error: 'API key not configured',
          message: 'Please add your Gemini API key to .env.local file. Get one free at https://aistudio.google.com/apikey',
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_PROMPT + `\n\nThe user's preferred language is: ${language || 'hi'}. Adjust your response language accordingly.`,
    });

    // Build conversation history for context
    // Gemini requires history to start with 'user' role, so drop leading 'model' entries
    const rawHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
    // Drop leading model messages so history starts with 'user'
    const firstUserIdx = rawHistory.findIndex((m: { role: string }) => m.role === 'user');
    const chatHistory = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history: chatHistory,
    });

    // Use streaming for real-time response
    const result = await chat.sendMessageStream(lastMessage.content);

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Stream error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: 'Failed to get AI response', message },
      { status: 500 }
    );
  }
}
