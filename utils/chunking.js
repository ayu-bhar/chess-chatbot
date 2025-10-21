export function chunkText(text, size = 1000) {
  const sentences = text.split(/(?<=\.)/g);
  const chunks = [];
  let buffer = "";

  for (let sentence of sentences) {
    if ((buffer + sentence).length > size) {
      chunks.push(buffer.trim());
      buffer = sentence;
    } else {
      buffer += sentence;
    }
  }
  if (buffer) chunks.push(buffer.trim());
  // console.log("chunking complete");
  // console.log(`Chunked text into ${chunks.length} chunks.`);
  return chunks;
}
