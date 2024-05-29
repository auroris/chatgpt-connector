import OpenAI from "openai";
import { completeDeferredInteraction } from "./completeDeferredInteraction.js";
const Buffer = require("buffer").Buffer;

const imageGenerationTimeout = 60000; // 60 seconds timeout
const imageDownloadTimeout = 25000; // 25 seconds timeout

/**
 * Handles the DALL-E command interaction.
 * @param {Object} interaction - The interaction object from Discord.
 * @param {string} apiKey - The API key for OpenAI.
 * @param {string} discordToken - The token for the Discord bot.
 */
export async function dalleCommand(interaction, apiKey, discordToken) {
  var prompt =
    interaction.data.options?.find((option) => option.name === "prompt")
      ?.value || "A photograph of a cat.";
  const hd =
    interaction.data.options?.find((option) => option.name === "hd")?.value ??
    true;
  const revise =
    interaction.data.options?.find((option) => option.name === "revise")
      ?.value ?? true;
  const ratio =
    interaction.data.options?.find((option) => option.name === "ratio")
      ?.value || "square";

  const openai = new OpenAI({ apiKey });

  try {
    if (!revise) {
      prompt = `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${prompt}`;
    }
    console.log(
      `${interaction.id} DallE-3 Prompt (${interaction.member.user.global_name}): ${prompt}`,
    );

    const response = await withTimeout(
      openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size:
          ratio === "square"
            ? "1024x1024"
            : ratio === "wide"
              ? "1792x1024"
              : "1024x1792",
        quality: hd ? "hd" : "standard",
      }),
      imageGenerationTimeout,
    );

    if (!response.data || response.data.length === 0) {
      await completeDeferredInteraction(
        "No images were generated by Dall-E 3.",
        null,
        null,
        discordToken,
        interaction.application_id,
        interaction.token,
      );
      console.log(`${interaction.id} No images were generated by Dall-E 3.`);
      return;
    }

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt || "";
    const message = revisedPrompt ? `Revised Prompt: ${revisedPrompt}` : "";

    console.log(`${interaction.id} Image URL received: ${imageUrl}`);

    // Download the image
    console.log(`${interaction.id} Starting image download...`);
    const imageResponse = await withTimeout(
      fetch(imageUrl, { method: "GET" }),
      imageDownloadTimeout,
    );

    if (!imageResponse.ok) {
      throw new Error(
        `Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`,
      );
    }

    const imageBuffer = new Blob(
      [Buffer.from(await imageResponse.arrayBuffer())],
      { type: "image/png" },
    );

    // Upload the image to Discord
    console.log(`${interaction.id} Uploading image to Discord...`);
    await completeDeferredInteraction(
      message,
      imageBuffer,
      null,
      discordToken,
      interaction.application_id,
      interaction.token,
    );
    console.log(`${interaction.id} Image sent to Discord.`);
  } catch (error) {
    console.error(`${interaction.id} Error handling DALL-E request:`, error);
    if (error.response) {
      await completeDeferredInteraction(
        `Error handling DALL-E request: ${error.response.status} ${error.response.data}`,
        null,
        null,
        discordToken,
        interaction.application_id,
        interaction.token,
      );
    } else {
      await completeDeferredInteraction(
        error.message,
        null,
        null,
        discordToken,
        interaction.application_id,
        interaction.token,
      );
    }
  }
}

/**
 * Wraps a promise with a timeout.
 * @param {Promise} promise - The promise to wrap.
 * @param {number} timeoutMs - The timeout in milliseconds.
 * @returns {Promise} A promise that resolves or rejects based on the original promise or the timeout.
 */
async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeoutMs),
  );
  return Promise.race([promise, timeout]);
}
