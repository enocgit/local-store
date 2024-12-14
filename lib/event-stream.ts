export const clients = new Map<
  string,
  { response: Response; writer: WritableStreamDefaultWriter }
>();

export async function sendEventToClient(
  userId: string,
  event: string,
  data: any,
) {
  const client = clients.get(userId);
  if (client) {
    const encoder = new TextEncoder();
    await client.writer.write(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
    );
  }
}
