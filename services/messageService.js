import { sql } from "../database/database.js";

// Function to retrieve the 5 most recent messages
const findRecentMessages = async () => {
  return await sql`
    SELECT * FROM messages 
    ORDER BY id DESC
    LIMIT 5
  `;
};

// Function to add a new message to the database
const createMessage = async (sender, message) => {
  await sql`
    INSERT INTO messages (sender, message)
    VALUES (${sender}, ${message})
  `;
};

export { createMessage, findRecentMessages };
