// declare module "busboy" {
//   import { IncomingHttpHeaders } from "http";
//   import { Readable, Stream, Writable } from "stream";

//   interface BusboyConfig {
//     headers: IncomingHttpHeaders;
//   }

//   interface BusboyFileEvent extends Readable {
//     [Symbol.asyncIterator](): AsyncIterableIterator<Buffer>;
//   }

//   class Busboy extends Writable {
//     constructor(config: BusboyConfig);
//     on(
//       event: "file",
//       listener: (
//         fieldname: string,
//         file: BusboyFileEvent,
//         filename: string,
//         encoding: string,
//         mimetype: string
//       ) => void
//     ): this;
//     on(event: "finish", listener: () => void): this;
//   }

//   export = Busboy;
// }

declare module "busboy" {
  import { IncomingHttpHeaders } from "http";
  import { Readable, Writable } from "stream";

  interface BusboyConfig {
    headers: IncomingHttpHeaders;
  }

  interface BusboyFileEvent extends Readable {
    [Symbol.asyncIterator](): AsyncIterableIterator<Buffer>;
  }

  function Busboy(config: BusboyConfig): BusboyInstance;

  interface BusboyInstance extends Writable {
    on(
      event: "file",
      listener: (
        fieldname: string,
        file: BusboyFileEvent,
        filename: string,
        encoding: string,
        mimetype: string
      ) => void
    ): this;
    on(event: "finish", listener: () => void): this;
  }

  export = Busboy;
}
