import fs from 'node:fs/promises';
import http from 'node:http';
import open from 'open';

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, placeholder) => {
    return data[placeholder] || '';
  });
};

const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
      <div class="note">
        <p>
          ${note.content}
        </p>
        <div class="tags">
        ${note.tags.map((tag) => `<span class="tag">${tag}</span>`)}
        </div>
      </div>
    `;
    })
    .join('\n');
};

const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const htmlPath = new URL('./template.html', import.meta.url);
    const template = await fs.readFile(htmlPath, 'utf-8');
    const html = interpolate(template, { notes: formatNotes(notes) });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
};

export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    const address = `http://localhost:${port}`;
    console.log(`Server on address ${address}`);
    open(address);
  });
};
