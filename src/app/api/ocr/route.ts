import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API Key is missing. Please add it to .env.local" }, { status: 500 });
    }

    const prompt = `You are an expert OCR AI. 
Your ONLY job is to extract exactly what is written in the provided images.
1. Extract EVERY single character, word, sentence, formula, and diagram description EXACTLY as they appear.
2. DO NOT hallucinate. DO NOT summarize. DO NOT add any external knowledge or context.
3. If there are multiple images, combine the exact text sequentially.
4. Format the exact text cleanly using Markdown (H1, H2, bullet points, code blocks) so it looks professional, but keep the data 100% identical to the images.
Do not include conversational filler - output ONLY the markdown notes.`;

    const contentBlocks: any[] = [{ type: "text", text: prompt }];

    images.forEach(img => {
      const imageUrl = img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`;
      contentBlocks.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CampusOS Web App",
      },
      body: JSON.stringify({
        model: "openrouter/free", // Stable auto-routing endpoint to prevent 404s
        messages: [
          {
            role: "user",
            content: contentBlocks
          }
        ],
        temperature: 0.0 // 0.0 temperature for absolute factual extraction without variation
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return NextResponse.json({ error: `OpenRouter API returned status ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const markdownNotes = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ notes: markdownNotes });

  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
