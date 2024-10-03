import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import { sql } from "./database/database.js";
import * as messageService from "./services/messageService.js";

// Configure the view engine to look for templates in the "./views" directory
configure({ views: "./views" });

// Function to create the messages table if it doesn't exist
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

// Redirect helper function for POST/Redirect/GET pattern
const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

// Function to show the form and list recent messages (GET request)
const showFormAndMessages = async () => {
  const messages = await messageService.findRecentMessages(); // Get recent messages from the DB
  const data = { messages }; // Pass messages to the template for rendering
  return new Response(await renderFile("index.eta", data), responseDetails); // Render the form and messages
};

// Function to handle message form submission (POST request)
const addMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messageService.createMessage(sender, message); // Add message to DB

  return redirectTo("/"); // Redirect after POST request to render the form again
};

// Handle requests: POST for form submission, GET for rendering form and listing messages
const handleRequest = async (request) => {
  if (request.method === "POST") {
    return await addMessage(request); // Handle form submission
  } else {
    return await showFormAndMessages(); // Render form and list messages on GET request
  }
};

// Start the server on port 7777
serve(handleRequest, { port: 7777 });
