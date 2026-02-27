export const generateWithHF = async (prompt: string) => {
    // StarCoder v1 is decommissioned on the serverless Inference API.
    // We use Qwen2.5-Coder-32B-Instruct, which is significantly more powerful for code.
    const modelName = "Qwen/Qwen2.5-Coder-32B-Instruct";

    // Use the OpenAI-compatible router endpoint which is robust and supports chat models.
    const url = `https://router.huggingface.co/v1/chat/completions`;

    console.log(`Generating code using model: ${modelName}`);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: modelName,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.1,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`HF Router API Error (${response.status}): ${errorText}`);
        throw new Error(`HF Router API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || data.error);
    }

    // The OpenAI-compatible endpoint returns an object with choices
    return data.choices?.[0]?.message?.content || data.generated_text;
};
