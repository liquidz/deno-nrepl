import { NreplClientImpl } from "./impl/nrepl.ts";
import { NreplClient } from "./types.ts";

export async function connect(
  { hostname, port }: { hostname?: string; port: number },
): Promise<NreplClient> {
  const conn = await Deno.connect({
    hostname: hostname || "127.0.0.1",
    port: port,
  });
  return new NreplClientImpl({ conn: conn });
}
