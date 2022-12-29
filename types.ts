import { async, bencode, io } from "./deps.ts";

export interface NreplResponse {
  readonly response: bencode.BencodeObject;
  context: Context;
  id(): string | null;
  getFirst(key: string): bencode.Bencode;
  getAll(key: string): bencode.Bencode[];
  isDone(): boolean;
}

export type NreplRequest = bencode.BencodeObject;

export type Context = Record<string, string>;

export interface NreplDoneResponse extends NreplResponse {
  readonly responses: NreplResponse[];
  readonly context: Context;
}

export type NreplStatus = "Waiting" | "Evaluating" | "NotConnected";

export type NreplWriteOption = {
  context: Context;
};

export interface NreplClient {
  readonly conn: Deno.Conn;
  readonly bufReader: io.BufReader;
  readonly bufWriter: io.BufWriter;
  readonly isClosed: boolean;
  readonly status: NreplStatus;

  close(): void;
  read(): Promise<NreplResponse>;
  write(
    message: NreplRequest,
    option?: NreplWriteOption,
  ): Promise<NreplDoneResponse>;
}

type RequestBody = {
  deferredResponse: async.Deferred<NreplDoneResponse>;
  responses: NreplResponse[];
  context: Context;
};

export type RequestManager = Record<string, RequestBody>;
