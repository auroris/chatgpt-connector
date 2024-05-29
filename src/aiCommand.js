import OpenAI from "openai";
import { fetchLastChannelMessages } from "./fetchDiscord.js";

/**
 * Handles chats with gpt-3.5-turbo
 * @param {Object} interaction - The interaction object from Discord.
 * @param {string} apiKey - The API key for OpenAI.
 */
export async function aiCommand(interaction, apiKey, discordToken) {
    const prompt = interaction.data.options?.find((option) => option.name === "prompt")?.value || "Hello!";
    const openai = new OpenAI({ apiKey: apiKey });
    const nick = interaction.member.nick != null ? interaction.member.nick : interaction.member.user.global_name;

    try {
        console.log(`${interaction.id} Prompt (${interaction.member.user.global_name}): ${prompt}`);

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant. The user's name and message are seperated by a colon." },
                { role: "user", content: `${nick}: ${prompt}` },
            ],
            model: "gpt-3.5-turbo",
        });

        if (!completion.choices || completion.choices.length === 0) {
            throw new Error("No choices returned from OpenAI API");
        }

        return `${nick}: ${prompt}\nGPT: ${completion.choices[0].message.content}`;
    } catch (error) {
        console.error("Error fetching OpenAI response:", error);
        return "There was an error processing your request. Please try again later.";
    }
}
