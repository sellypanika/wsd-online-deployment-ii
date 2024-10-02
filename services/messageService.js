import { sql } from "../database/database.js";

const recentMessages = async function (limit = 5) {
  return await sql`
    SELECT sender, message FROM messages
    ORDER BY id DESC
    LIMIT ${limit}
  `;
};

const addMessage = async function (sender, message) {
  await sql`
    INSERT INTO messages (sender, message)
    VALUES (${sender}, ${message})
  `;
};

export { addMessage, recentMessages };
