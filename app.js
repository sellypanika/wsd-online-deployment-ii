import { serve } from "./deps.js";
import { configure, postgres, renderFile } from "./deps.js";
import { sql } from "./database/database.js";
import * as messageService from "./services/messageService.js";

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
  const formData = await request.formData();

  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.createMessage(sender, message); // Add message to DB

  return redirectTo("/"); // Redirect after POST
};

// List the recent messages
const listMessages = async (request) => {
  const messages = await messageService.findRecentMessages();

  const data = {
    messages: messages,
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

// Handle requests: GET and POST
const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (request.method === "POST") {
    return await addMessage(request); // Handle form submission
  } else {
    return await listMessages(request); // List messages on GET request
  }
};

// Start the server
serve(handleRequest, { port: 7777 });
