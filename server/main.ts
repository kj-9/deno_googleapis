#!/usr/bin/env -S deno run --allow-read=. --allow-net --allow-env --allow-hrtime
import { request } from "../base/mod.ts";
import { assert } from "../generator/deps.ts";
import { RestDescription } from "../generator/discovery:v1.gen.ts";
import { generate, primaryName } from "../generator/generator.ts";
import { Discovery, router, serve } from "./deps.ts";

const discovery = new Discovery();
const list = await discovery.apisList({ preferred: true });

const handler = router({
  "GET@/": home,
  "GET@/v1/{:api}\\:{:version}.ts": code,
  "GET@/v1/{:api}\\:{:version}": code,
  "GET@/_/base@v1/:path*": staticFiles,
});

async function staticFiles(
  req: Request,
  { path }: Record<string, string>,
): Promise<Response> {
  const url = new URL("../base/", import.meta.url);
  url.pathname += path;
  try {
    const resp = await fetch(url.href);
    const module = await resp.text();
    const acceptsHtml = req.headers.get("accept")?.includes("text/html");
    if (acceptsHtml) {
      return new Response(module, {
        headers: {
          "content-type": "text/plain",
        },
      });
    }
    return new Response(module, {
      headers: {
        "content-type": "application/typescript; charset=utf-8",
      },
    });
  } catch {
    return new Response(`Not found: ${url.href}`, {
      status: 404,
    });
  }
}

function home(req: Request): Response {
  const origin = new URL(req.url).origin;
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Google API CLIs for Deno</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1, h2 {
        color: #1a73e8;
      }
      pre {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
      }
      code {
        font-family: 'Courier New', Courier, monospace;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        table-layout: fixed;
      }
      th, td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: left;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      th {
        background-color: #f2f2f2;
      }
      th:nth-child(1), td:nth-child(1) { width: 25%; }
      th:nth-child(2), td:nth-child(2) { width: 35%; font-size: 0.9em; }
      th:nth-child(3), td:nth-child(3) { width: 35%; font-size: 0.9em; }
      th:nth-child(4), td:nth-child(4) { width: 5%; }
      td:nth-child(2) pre, td:nth-child(3) pre {
        margin: 0;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <h1>Google API CLIs for Deno</h1>
    <p>
      This service provides auto-generated Google API CLIs for Deno.
    </p>
    <h2>Example to install cli</h2>
    <p>You can install the generated cli with <code>deno install</code> command.</p>
    <p>For example, you can install the YouTube Data API v3 cli:</p>
    <pre><code>$ deno install -g -n youtube --allow-net ${origin}/v1/youtube:v3.ts</code></pre>
    <p>Then you can run the cli with the command name:</p>
    <pre><code>$ youtube -h</code></pre>
    <h2>Services</h2>
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Run</th>
          <th>Install</th>
        </tr>
      </thead>
      <tbody>
${
    list.items!.map((service) => {
      const url = `${origin}/v1/${service.id}.ts`;
      assert(service.name);
      assert(service.title);
      const name = primaryName(service.name, service.title?.split(" "));
      return `
        <tr>
          <td><a href="${url}">${service.title}</a></td>
          <td><pre><code>deno run --allow-net ${url} -h</code></pre></td>
          <td><pre><code>deno install -g -n ${name.toLowerCase()} --allow-net ${url}</code></pre></td>
        </tr>`;
    }).join("\n")
  }
      </tbody>
    </table>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
async function code(
  req: Request,
  { api, version }: Record<string, string>,
): Promise<Response> {
  const discoveryRestUrl =
    list.items!.find((service) =>
      service.name === api && service.version === version
    )!.discoveryRestUrl;
  if (!discoveryRestUrl) {
    return new Response(`Not found: ${api} ${version}`, {
      status: 404,
    });
  }
  const service: RestDescription = await request(discoveryRestUrl, {
    client: undefined,
    method: "GET",
  });
  const module = generate(service, req.url);
  const acceptsHtml = req.headers.get("accept")?.includes("text/html");
  if (acceptsHtml) {
    return new Response(module, {
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  return new Response(module, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}

console.log("Listening on http://localhost:8000");
serve(handler);
