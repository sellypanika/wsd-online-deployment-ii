// app.js
import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import { sql } from "./database/database.js";
import * as messageService from "./services/messageService.js";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

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

const handleRequest = async (req) => {
  const url = new URL(req.url);

  // Handle GET request at root
  if (url.pathname === "/") {
    const messages = await getRecentMessages();
    const body = await renderFile("index.eta", { messages: messages });
    return new Response(body, { headers: { "Content-Type": "text/html" } });
  }

  // Handle POST request at root (form submission)
  if (url.pathname === "/" && req.method === "POST") {
    const formData = await req.formData();
    const sender = formData.get("sender");
    const message = formData.get("message");

    if (sender && message) {
      // Add message to the database
      await addMessage(sender, message);
      return new Response(null, {
        status: 303,
        headers: { "Location": "/" },
      });
    }

    return new Response("Invalid input", { status: 400 });
  }

  // Handle 404 for other paths
  return new Response("Not Found", { status: 404 });
};

// Function to get recent messages
async function getRecentMessages() {
  return await messageService.recentMessages();
}

// Function to add a message
async function addMessage(sender, message) {
  await messageService.addMessage(sender, message);
}

// Start the server
serve(handleRequest, { port: 7777 });
