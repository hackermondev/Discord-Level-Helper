import config from "../config/config";

// Use node-fetch instead of browser fetch
import nodeFetch, { Headers } from "node-fetch";

interface GuildDetailsPlayer {
  avatar: string;
  detailed_xp: number[];
  discriminator: string;
  guild_id: string;
  id: string;
  level: string;
  message_count: number;
  username: string;
  xp: number;
}

interface GuildDetailsI {
  player: GuildDetailsPlayer | null;
  players: GuildDetailsPlayer[];
}

var isRunningTests = process?.env?.NODE_ENV == `test`;

class MEE6Api {
  private _host: string;
  private defaultRequestHeaders: Headers;
  private _token: string | null;

  private _fetch: Function;

  constructor() {
    this._host = config.mee6.host;
    this._token = null;

    if (!isRunningTests) {
      chrome.storage.local.get([`mee6_account_token`], (result) => {
        if (result["mee6_account_token"]) {
          this._token = result["mee6_account_token"];

          console.log(`MEE6 Account Token is ${this._token}`);
          this.defaultRequestHeaders.set(`authorization`, this._token || ``);
        } else {
          console.log(`Waiting for MEE6 token...`);
        }
      });

      chrome.runtime.onMessage.addListener(
        (message: any, sender: chrome.runtime.MessageSender) => {
          if (message.op == `mee6_account_token`) {
            console.log(`Got MEE6 token: ${message.d}`);
            this._token = message.d;

            console.log(`MEE6 Account Token is ${this._token}`);
            this.defaultRequestHeaders.set(`authorization`, this._token || ``);
          }
        }
      );

      this._fetch = fetch.bind(window);
    } else {
      this._fetch = nodeFetch;
    }

    this.defaultRequestHeaders = new Headers();

    this.defaultRequestHeaders.set(
      `User-Agent`,
      `Discord-Level-Helper-Chrome Extension/1.0`
    );
    this.defaultRequestHeaders.set(`authorization`, this._token || ``);
  }

  async getGuildInfo(
    guildID: string,
    callback: (guildDetails: GuildDetailsI, isOkay: boolean) => void
  ): Promise<void> {
    const fetchURL = `https://${this._host}/api/plugins/levels/leaderboard/${guildID}`;

    const req = await this._fetch(fetchURL, {
      headers: this.defaultRequestHeaders,
      method: `GET`,
    });

    const data = await req.json();

    callback(data, req.ok);
  }
}

export { GuildDetailsPlayer };

export default MEE6Api;
