# ChatGPT Discord Connector

This project is a ChatGPT connector for Discord that runs as a Cloudflare worker. It is based on the article ["Hosting a Reddit API Discord app on Cloudflare Workers"](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers).

## Description

This project demonstrates integration of OpenAI's ChatGPT with a Discord server using Cloudflare Workers. It allows you to set up a bot that can interact with users on your Discord server, leveraging the capabilities of ChatGPT for various interactions.

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
   Create a `.dev.vars` file in the root directory from `.dev.vars.example` and fill out the variables with your bot's secrets.

4. **Deploy to Cloudflare Workers:**
   Follow the instructions in the Cloudflare Workers documentation to deploy your worker. You will need to create a new worker and copy the contents of `server.js` to the worker script.

## Usage

Once the bot is deployed, invite it to your Discord server using the OAuth2 URL generated in the Discord Developer Portal. The bot will listen for messages and respond using ChatGPT.

## Files

- `commands.js`: Defines the metadata for the bot commands.
- `completeDeferredInteraction.js`: Handles completing a deferred Discord interaction, allowing the bot to send a message with an optional attachment after a delay.
- `aiCommand.js`: Implements the logic for handling the ai command, which sends a message to ChatGPT and returns the response.
- `dalleCommand.js`: Implements the logic for handling the imagine command, which generates an image using DALL-E based on the provided prompt and options.
- `register.js`: Contains the code for registering the bot commands with Discord, ensuring that the commands are recognized and can be used in the server.
- `server.js`: The main entry point for the Cloudflare Worker. It routes incoming requests to the appropriate command handlers and provides utility functions for JSON responses.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas or improvements.

## License

This project is licensed under the MIT License.
