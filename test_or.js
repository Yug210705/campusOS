const models = [
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "openrouter/free"
];

async function testModels() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("No API key found in env");
    return;
  }

  // Create a 1x1 black pixel base64 image
  const base64Image = "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

  for (const model of models) {
    console.log(`Testing ${model} with image...`);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [{ 
            role: "user", 
            content: [
              { type: "text", text: "What is this?" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }]
        })
      });
      console.log(`${model}: HTTP ${res.status}`);
      if (!res.ok) {
        console.log(await res.text());
      } else {
        const data = await res.json();
        console.log("Success:", data.choices[0].message.content.substring(0, 50));
      }
    } catch (e) {
      console.error(e);
    }
  }
}
testModels();
