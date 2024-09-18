import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const data = {
  count: 0,
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (url.pathname === "/visit") {
    data.count++;
    return new Response(await renderFile("count.eta", data), responseDetails);
  }

  if (url.pathname === "/meaning") {
    return new Response("Seeking truths beyond meaning of life, you will find 43.");
  }

  return new Response("Nothing here yet.");
};

serve(handleRequest, { port: 7777 });