import { headers } from "next/headers";
import { clients } from "@/lib/event-stream";

export async function GET(req: Request) {
  const headerList = await headers();
  const userId = headerList.get("user-id");

  //   if (!userId) {
  //     return new Response("Unauthorized", { status: 401 });
  //   }

  //   const stream = new TransformStream();
  //   const writer = stream.writable.getWriter();
  //   const encoder = new TextEncoder();

  //   // Store both response and writer
  //   clients.set(userId, {
  //     response: new Response(stream.readable, {
  //       headers: {
  //         "Content-Type": "text/event-stream",
  //         "Cache-Control": "no-cache",
  //         Connection: "keep-alive",
  //       },
  //     }),
  //     writer,
  //   });

  //   // Remove client when connection closes
  //   req.signal.addEventListener("abort", () => {
  //     clients.delete(userId);
  //   });

  //   return clients.get(userId)!.response;
}

// export async function sendEventToClient(
//   userId: string,
//   event: string,
//   data: any,
// ) {
//   // ... function implementation ...
// }
