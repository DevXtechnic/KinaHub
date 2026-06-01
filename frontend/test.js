const apiKey = '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';
const FREE_MODELS = ['openai/gpt-oss-20b:free'];
async function test() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: FREE_MODELS[0], messages: [{role: 'user', content: 'hello'}] })
    });
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
  } catch (e) {
    console.error("Fetch threw:", e);
  }
}
test();
