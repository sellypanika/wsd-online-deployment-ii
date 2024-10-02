// app.js
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

const handleRequest = async (req) => {
  const { method } = req;

  // Handle GET request to display messages
  if (method === "GET") {
    try {
      // Fetch recent messages
      const messages = await getRecentMessages();

      // Render the HTML with messages
      const html = await renderFile("./views/index.eta", { messages });

      return new Response(html, {
        headers: { "content-type": "text/html" },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Handle POST request to submit a new message
  if (method === "POST") {
    try {
      const formData = await req.formData();
      const sender = formData.get("sender");
      const message = formData.get("message");

      if (!sender || !message) {
        return new Response("Both sender and message are required", {
          status: 400,
        });
      }

      // Add message to the database
      await addMessage(sender, message);

      // Redirect after adding the message (303)
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    } catch (error) {
      console.error("Error handling POST request:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Return Method Not Allowed for unsupported methods
  return new Response("Method Not Allowed", { status: 405 });
};
// Function to get recent messages
async function getRecentMessages() {
  return await messageService.recentMessages();
}

// Function to add a message
async function addMessage(sender, message) {
  await messageService.addMessage(sender, message);
}

/* const url = new URL(req.url);

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
*/
// Start the server
serve(handleRequest, { port: 7777 });
