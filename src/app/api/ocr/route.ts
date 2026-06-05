import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API Key is missing. Please add it to .env.local" }, { status: 500 });
    }

    // Ensure the image string has the correct format (e.g. data:image/jpeg;base64,...)
    // If it's just raw base64, prepend the data URI scheme.
    const imageUrl = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

    const prompt = `You are an expert academic assistant and OCR AI. 
Please scan the provided image of a whiteboard, notebook, or study material.
1. Extract ALL text, formulas, diagrams descriptions, and characters with 100% accuracy.
2. Format the extracted information into highly professional, detailed study notes using Markdown.
3. Use appropriate headings (H1, H2, H3), bullet points, bold text for key terms, and code blocks for any code or structured data.
4. If there are lists or steps, format them cleanly.
5. Your output should look like an immaculate A4 study sheet.
Do not include conversational filler like "Here are the notes" - output ONLY the markdown notes.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CampusOS Web App",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free", // Free vision model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
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
