// app.js
import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import { sql } from "./database/database.js";
import * as messageService from "./services/messageService.js"; // Fix the name

configure({ views: "./views" });

async function createTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender TEXT NOT NULL,
      message TEXT NOT NULL
    );
  `;
}

// Run table creation on application startup
createTable();

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

// Redirect helper function (POST/Redirect/GET pattern)
const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

// Handle message form submission
const addMessage = async (request) => {
  try {
    const formData = await request.formData();
    const sender = formData.get("sender");
    const message = formData.get("message");

    if (!sender || !message) {
      return new Response("Sender and message are required!", {
        status: 400,
      });
    }

    await messageService.createMessage(sender, message); // Add message to DB
    return redirectTo("/"); // Redirect after POST
  } catch (error) {
    console.error("Error adding message:", error);
    return new Response("Failed to add message", { status: 500 });
  }
};

// List the recent messages
const listMessages = async () => {
  try {
    const messages = await messageService.findRecentMessages();
    const data = {
      messages: messages,
    };
    return new Response(await renderFile("index.eta", data), responseDetails);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return new Response("Failed to load messages", { status: 500 });
  }
};

// Handle requests: GET and POST
const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (request.method === "POST") {
    return await addMessage(request); // Handle form submission
  } else {
    return await listMessages(); // List messages on GET request
  }
};

// Start the server
serve(handleRequest, { port: 7777 });
