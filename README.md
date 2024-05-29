# ChatGPT Discord Connector

This project is a ChatGPT connector for Discord that runs as a Cloudflare worker. It is based on the article ["Hosting a Reddit API Discord app on Cloudflare Workers"](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers).

## Description

This project enables integration of OpenAI's ChatGPT with a Discord server using Cloudflare Workers. It allows you to set up a bot that can interact with users on your Discord server, leveraging the capabilities of ChatGPT for various interactions.

## Prerequisites

- A Discord account
- A Discord server where you have permission to add a bot
- A Cloudflare account
- Node.js and npm installed on your local machine

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   DISCORD_BOT_TOKEN=<your-discord-bot-token>
   OPENAI_API_KEY=<your-openai-api-key>
   ```

4. **Deploy to Cloudflare Workers:**
   Follow the instructions in the Cloudflare Workers documentation to deploy your worker. You will need to create a new worker and copy the contents of `server.js` to the worker script.

## Usage

Once the bot is deployed, invite it to your Discord server using the OAuth2 URL generated in the Discord Developer Portal. The bot will listen for messages and respond using ChatGPT.

## Files

- `commands.js`: Contains the command handling logic for the bot.
- `completeDeferredInteraction.js`: Manages deferred interactions.
- `dalleCommand.js`: Handles DALL-E related commands.
- `register.js`: Registers the commands with Discord.
- `server.js`: The main entry point of the Cloudflare worker.
- `aiCommand.js`: Handles AI-related commands.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas or improvements.

## License

This project is licensed under the MIT License.
