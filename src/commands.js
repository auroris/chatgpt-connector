/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const AI_COMMAND = {
  name: "ai",
  description: "Send a message to ChatGPT",
  options: [
    {
      name: "prompt",
      type: 3, // 3 represents a string type
      description: "The message to send to ChatGPT",
      required: true,
    },
  ],
};

export const DALLE_COMMAND = {
  name: "imagine",
  description: "Generate an image with DALL-E",
  options: [
    {
      name: "prompt",
      description: "The prompt for DALL-E",
      type: 3, // STRING type
      required: true,
    },
    {
      name: "ratio",
      description: "Image ratio (default: square)",
      type: 3, // STRING type
      required: false,
      choices: [
        {
          name: "Square",
          value: "square",
        },
        {
          name: "Wide",
          value: "wide",
        },
        {
          name: "Tall",
          value: "tall",
        },
      ],
    },
    {
      name: "revise",
      description:
        "Allow Dall-E to automatically revise your prompt (default: true)",
      type: 5, // BOOLEAN type
      required: false,
    },
    {
      name: "hd",
      description: "Generate image in HD quality (default: true)",
      type: 5, // BOOLEAN type
      required: false,
    },
  ],
};
