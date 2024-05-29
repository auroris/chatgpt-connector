/**
 * Sanitizes a content string for use in a Discord webhook.
 *
 * This function performs the following sanitizations:
 * - Trims leading and trailing whitespace.
 * - Escapes special characters that could be interpreted as Markdown.
 * - Removes potential user, role, and channel mentions.
 * - Ensures the content length does not exceed Discord's message length limit (2000 characters).
 *
 * @param {string} content - The content string to sanitize.
 * @returns {string} - The sanitized content string.
 *
 * @example
 * const sanitizedContent = sanitizeDiscordContent("Hello, this is a test message! <@1234567890> #general");
 * console.log(sanitizedContent); // Outputs: Hello, this is a test message! [mention] [channel]
 */
export function sanitizeDiscordContent(content) {
    // Trim leading and trailing whitespace
    content = content.trim();

    // Escape characters that could be interpreted as Markdown
    const escapeChars = {
        "*": "\\*",
        _: "\\_",
        "`": "\\`",
        "~": "\\~",
        "|": "\\|",
        ">": "\\>",
        "@": "\\@",
        "#": "\\#",
        ":": "\\:",
        "!": "\\!",
        "[": "\\[",
        "]": "\\]",
        "(": "\\(",
        ")": "\\)",
    };

    content = content.replace(/[\*\_\`\~\|\>\@\#\:\!\[\]\(\)]/g, (match) => escapeChars[match]);

    // Remove any potential mentions
    content = content.replace(/<@!?(\d+)>/g, "[mention]");
    content = content.replace(/<@&(\d+)>/g, "[role]");
    content = content.replace(/<#(\d+)>/g, "[channel]");

    // Ensure content length does not exceed 2000 characters
    if (content.length > 2000) {
        content = content.substring(0, 1997) + "...";
    }

    return content;
}

/**
 * Wraps a promise with a timeout.
 * @param {Promise} promise - The promise to wrap.
 * @param {number} timeoutMs - The timeout in milliseconds.
 * @returns {Promise} A promise that resolves or rejects based on the original promise or the timeout.
 */
export async function withTimeout(promise, timeoutMs) {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeoutMs));
    return Promise.race([promise, timeout]);
}
