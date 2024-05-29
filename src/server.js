import { Router } from "itty-router";
import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { AI_COMMAND, DALLE_COMMAND } from "./commands.js";
import { aiCommand } from "./aiCommand.js";
import { dalleCommand } from "./dalleCommand.js";

// Initialize the router
const router = Router();

/**
 * Handle GET requests to the root URL.
 * @param {Request} request - The request object.
 * @param {Object} env - Environment variables.
 * @param {Event} event - The event object.
 * @returns {Response} A response with the Discord application ID.
 */
router.get("/", (request, env, event) => {
    return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Handle POST requests to the root URL.
 * Verifies the request signature and processes Discord interactions.
 * @param {Request} request - The request object.
 * @param {Object} env - Environment variables.
 * @param {Event} event - The event object.
 * @returns {Response} A response based on the interaction type.
 */
router.post("/", async (request, env, event) => {
    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.text();
    const isValid = signature && timestamp && verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    const interaction = isValid ? JSON.parse(body) : null;

    if (!isValid || !interaction) {
        return new Response("Bad request signature.", { status: 401 });
    }

    if (interaction.type === InteractionType.PING) {
        return new JsonResponse({
            type: InteractionResponseType.PONG,
        });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        switch (interaction.data.name.toLowerCase()) {
            // Using ChatGPT 3.5, return a response
            case AI_COMMAND.name.toLowerCase(): {
                console.log(interaction);
                return new JsonResponse({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: await aiCommand(interaction, env.OPENAI_API_KEY, env.DISCORD_TOKEN),
                    },
                });
            }

            // Using Dall-E 3, return a response with a promise to supply an image later
            case DALLE_COMMAND.name.toLowerCase(): {
                event.waitUntil(dalleCommand(interaction, env.OPENAI_API_KEY, env.DISCORD_TOKEN));
                return new JsonResponse({
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                });
            }

            default:
                return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
        }
    }

    return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
});

/**
 * Handle all other routes with a 404 response.
 * @returns {Response} A response indicating the route was not found.
 */
router.all("*", () => new Response("Not Found.", { status: 404 }));
export default {
    /**
     * Fetch event handler to route requests.
     * @param {Request} request - The request object.
     * @param {Object} env - Environment variables.
     * @param {Event} event - The event object.
     * @returns {Response} The response from the router.
     */
    fetch: async function (request, env, event) {
        return router.handle(request, env, event);
    },
};

/**
 * Custom JsonResponse class to handle JSON responses.
 */
class JsonResponse extends Response {
    /**
     * Constructor for JsonResponse.
     * @param {Object} body - The response body.
     * @param {Object} init - The response init object.
     */
    constructor(body, init) {
        const jsonBody = JSON.stringify(body);
        init = init || {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        };
        super(jsonBody, init);
    }
}
