import { sanitizeDiscordContent } from "./util.js";

/**
 * Complete a deferred Discord interaction by sending a message with an optional attachment.
 *
 * This function is used to update a deferred response in a Discord bot interaction. It supports
 * sending a text message with an optional attachment, which can be any type of file.
 *
 * @param {string} text - The text message to be sent.
 * @param {Blob|null} attachment - The optional attachment file as a Blob object. If null, only the text message is sent.
 * @param {string|null} attachmentName - The name of the attachment file. If null, the function will assign a name based on the blob's mime type.
 * @param {string} discordToken - The bot's authorization token.
 * @param {string} applicationId - The Discord application ID.
 * @param {string} interactionToken - The interaction token from the deferred response.
 * @returns {Promise<Response>} - The response from the Discord API.
 * @throws {Error} - Throws an error if the HTTP request to Discord fails.
 */
export async function completeDeferredInteraction(text, attachment, attachmentName, discordToken, applicationId, interactionToken) {
    const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;
    var headers = { Authorization: `Bot ${discordToken}` };
    var body = {};

    if (attachment) {
        if (!attachmentName) {
            const mimeType = attachment.type;
            attachmentName = `${mimeType.split("/")[0]}.${mimeType.split("/")[1]}`;
        }

        // Create form data for attachment upload
        body = new FormData();
        body.append("files[0]", attachment, attachmentName);

        const metadata = {
            content: sanitizeDiscordContent(text),
            attachments: [{ id: 0, filename: attachmentName }],
        };

        body.append("payload_json", JSON.stringify(metadata));
    } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ content: sanitizeDiscordContent(text) });
    }

    try {
        const response = await fetch(webhookUrl, { method: "PATCH", body: body, headers: headers });
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status} ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error("Error completing deferred interaction in Discord:", {
            text: text, // Log the original text input
            message: error.message,
            stack: error.stack,
            name: error.name,
            timestamp: new Date().toISOString(),
        });
    }
}
