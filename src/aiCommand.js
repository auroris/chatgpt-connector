import OpenAI from "openai";

export async function aiCommand(interaction, apiKey) {
  const prompt = interaction.data.options?.find(option => option.name === 'prompt')?.value || 'Hello!';
  const openai = new OpenAI({ apiKey: apiKey});

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." },
      {role: "user", content: prompt}],
      model: "gpt-3.5-turbo",
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No choices returned from OpenAI API');
    }

    return `**${interaction.member.user.global_name}:** ${prompt}\n**GPT:** ${completion.choices[0].message.content}`;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    return 'There was an error processing your request. Please try again later.';
  }
}
