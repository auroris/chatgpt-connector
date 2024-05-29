/**
 * Complete a deferred Discord interaction by sending a message with an optional attachment.
 *
 * This function is used to update a deferred response in a Discord bot interaction. It supports
 * sending a text message with an optional attachment, which can be any type of file.
 *
 * @param {string} text - The text message to be sent.
 * @param {Blob|null} attachment - The optional attachment file as a Blob object. If null, only the text message is sent.
 * @param {string|null} attachmentName - The name of the attachment file. If null, the function will auto-detect the file type and assign a name.
 * @param {string} discordToken - The bot's authorization token.
 * @param {string} applicationId - The Discord application ID.
 * @param {string} interactionToken - The interaction token from the deferred response.
 * @returns {Promise<Response>} - The response from the Discord API.
 * @throws {Error} - Throws an error if the HTTP request to Discord fails.
 */
export async function completeDeferredInteraction(text, attachment, attachmentName, discordToken, applicationId, interactionToken) {
  try {
    const webhookUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}/messages/@original`;

    if (attachment) {
      // Auto-detect attachment name if not provided
      if (!attachmentName) {
        const mimeType = attachment.type;
        const extension = mimeType.split('/')[1];
        attachmentName = `attachment.${extension}`;
      }

      // Create form data for attachment upload
      const formData = new FormData();
      formData.append('files[0]', attachment, attachmentName);

      const metadata = {
        content: text,
        attachments: [
          {
            id: 0,
            filename: attachmentName,
            description: text,
          },
        ],
      };

      formData.append('payload_json', JSON.stringify(metadata));

      // Upload the attachment to Discord
      const response = await fetch(webhookUrl, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Authorization': `Bot ${discordToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status} ${response.statusText}`);
      }

      return response;
    } else {
      const body = JSON.stringify({ content: text });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${discordToken}`,
      };

      // Send the text message to Discord
      const response = await fetch(webhookUrl, {
        method: 'PATCH',
        body: body,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status} ${response.statusText}`);
      }

      return response;
    }
  } catch (error) {
    console.error('Error completing deferred interaction in Discord:', error);
  }
}
