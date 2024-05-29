import dotenv from 'dotenv';
import process from 'node:process';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * This script is intended to be run from the command line and is not used by the
 * application server. It uses Node.js primitives and needs to be executed only once
 * to register Discord commands.
 */

// Load environment variables from the .dev.vars file
dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

// Ensure that required environment variables are set
if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the URL to the commands file
const commandsFilePath = path.join(__dirname, 'commands.js');
const commandsFileUrl = pathToFileURL(commandsFilePath).href;

/**
 * Imports commands from the commands.js file.
 * @returns {Promise<Array>} A promise that resolves to an array of commands.
 */
async function getCommands() {
  console.log(`Importing commands from: ${commandsFileUrl}`);
  const commandsModule = await import(commandsFileUrl);
  console.log('Imported commands module:', commandsModule);
  return Object.values(commandsModule);
}

/**
 * Registers the given commands with the Discord API.
 * @param {Array} commands - An array of commands to register.
 */
async function registerCommands(commands) {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),
  });

  if (response.ok) {
    console.log('Registered all commands');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('Error registering commands');
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) {
        errorText = `${errorText} \n\n ${error}`;
      }
    } catch (err) {
      console.error('Error reading body from request:', err);
    }
    console.error(errorText);
  }
}

// Self-invoking async function to get and register commands
(async () => {
  try {
    const commands = await getCommands();
    await registerCommands(commands);
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
})();
