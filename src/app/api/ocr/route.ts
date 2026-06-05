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

    const prompt = `You are an expert academic assistant and OCR AI. 
Please scan the provided image(s) of a whiteboard, notebook, or study material.
1. Extract ALL text, formulas, diagrams descriptions, and characters with 100% accuracy.
2. If there are multiple images, synthesize and merge the information logically into a single comprehensive document.
3. Format the extracted information into highly professional, detailed study notes using Markdown.
4. Use appropriate headings (H1, H2, H3), bullet points, bold text for key terms, and code blocks for any code or structured data.
5. If there are lists or steps, format them cleanly.
6. Your output should look like an immaculate A4 study sheet.
Do not include conversational filler like "Here are the notes" - output ONLY the markdown notes.`;

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
        model: "openrouter/free", // Automatically selects a free vision-capable model
        messages: [
          {
            role: "user",
            content: contentBlocks
          }
        ],
        temperature: 0.1 // Low temperature for factual extraction
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
