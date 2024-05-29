/**
 * Fetch the last several messages from a Discord channel.
 * @param {int} count - how many messages to retrieve
 * @param {string} channelId - The ID of the Discord channel.
 * @param {string} discordToken - The Discord bot token.
 * @returns {Array} An array of the last 10 messages.
 */
export async function fetchLastChannelMessages(count, channelId, discordToken) {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages?limit=${count}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bot ${discordToken}`,
        },
    });
    if (!response.ok) {
        console.error("Error fetching messages:", response.statusText);
        return [];
    }
    return await response.json();
}
