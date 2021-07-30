import discord from "./config/discord.json";
import mee6 from "./config/mee6.json";

interface DiscordConfigI {
  hostname: string;
  urlPattern: string;
}

interface MEE6ConfigI {
  host: string;
}

const discordConfig: DiscordConfigI = discord;
const mee6Config: MEE6ConfigI = mee6;

export default {
  discord: discord,
  mee6: mee6Config,
};
