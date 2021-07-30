import config from "./config/config";
import utils from "./utils/utils";

import MEE6Api, { GuildDetailsPlayer } from "./core/MEE6Api";

const mee6 = new MEE6Api();
var currentData: any = {};

var currentTab: string | null = null;
/*

######                                          #                                      #     #           #     #                                    ### 
#     # #  ####   ####   ####  #####  #####     #       ###### #    # ###### #         #     # #####     #     # ###### #      #####  ###### #####  ### 
#     # # #      #    # #    # #    # #    #    #       #      #    # #      #         #     # #    #    #     # #      #      #    # #      #    # ### 
#     # #  ####  #      #    # #    # #    #    #       #####  #    # #####  #         #     # #    #    ####### #####  #      #    # #####  #    #  #  
#     # #      # #      #    # #####  #    #    #       #      #    # #      #         #     # #####     #     # #      #      #####  #      #####      
#     # # #    # #    # #    # #   #  #    #    #       #       #  #  #      #         #     # #         #     # #      #      #      #      #   #  ### 
######  #  ####   ####   ####  #    # #####     ####### ######   ##   ###### ######     #####  #         #     # ###### ###### #      ###### #    # ### 
                                                                                                                                                        


*/

var discordTabUpdatedCallback = (tab: chrome.tabs.Tab) => {
  if (!tab.url) {
    return;
  }

  const tabURL: URL = new URL(tab.url);

  if (tabURL.hostname != config.discord.hostname) {
    return;
  }

  if (currentTab == tab.url) {
    return;
  }

  currentTab = tab.url;
  const tabDetails: string[] = tabURL.pathname.split("/");

  const guildID: string = tabDetails[2];

  if (guildID == undefined || guildID == "@me") {
    console.log(`User switched to DM channel.`);

    return;
  }

  console.log(`User switched to channel ${tabDetails[3]} and guild ${guildID}`);

  mee6.getGuildInfo(guildID, (guildDetails, isOkay: boolean) => {
    if (!isOkay) {
      return console.log(`Server doesn't have MEE6 leveling enabled.`);
    }

    if (guildDetails.player == null) {
      // chrome.tabs.create({ url: `https://${config.mee6.host}/api/login`})

      return console.log(`User is not logged in on MEE6.`);
    }

    currentData[guildID] = {
      level: guildDetails.player.level,
      xp: guildDetails.player.xp,
    };

    console.log(currentData);
  });
};

chrome.tabs.onCreated.addListener((tab: chrome.tabs.Tab) => {
  discordTabUpdatedCallback(tab);
});

chrome.tabs.onUpdated.addListener(
  (
    tabID: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    discordTabUpdatedCallback(tab);
  }
);

/**
 *
 * When a new message it sent, calculate the amount of XP the user earned from that message (if any) then start the timer for one minute
 */

chrome.webRequest.onCompleted.addListener(
  (request: chrome.webRequest.WebResponseCacheDetails) => {
    if (request.method != "POST") {
      return;
    }

    const url: URL = new URL(request.url);

    if (url.hostname != config.discord.hostname) {
      return;
    }
    // Only listen to messages
    if (!url.pathname.startsWith(`/api/v9/channels`)) {
      return;
    }

    const requestData: string[] = url.pathname.split("/");

    if (requestData.length != 6 || requestData[5] != `messages`) {
      return;
    }

    const channelID: string = requestData[4];

    console.log(`User sent message to channel id: ${channelID}`);

    chrome.tabs.get(request.tabId, (tab: chrome.tabs.Tab) => {
      if (!tab.url) {
        return;
      }

      const tabURL: URL = new URL(tab.url);
      const tabDetails: string[] = tabURL.pathname.split("/");

      const guildID: string = tabDetails[2];

      if (guildID == undefined || guildID == "@me") {
        return;
      }

      if (!currentData[guildID]) {
        return;
      }

      mee6.getGuildInfo(guildID, (guildDetails, isOkay: boolean) => {
        if (!isOkay) {
          return console.log(`Server doesn't have MEE6 leveling enabled.`);
        }

        if (guildDetails.player == null) {
          return console.log(`User is not logged in on MEE6.`);
        }

        if (guildDetails.player.level != currentData[guildID].level) {
          console.log(`Earned 1 level from message.`);

          chrome.tabs.sendMessage(tab.id || 0, { op: `level_earned`, d: 1 });

          // Start 1 minute timer
          chrome.tabs.sendMessage(tab.id || 0, {
            op: `start_timer`,
            d: 60,
            channel_id: tabDetails[3],
          });
        } else if (guildDetails.player.xp != currentData[guildID].xp) {
          var earnedXP = guildDetails.player.xp - currentData[guildID].xp;

          var xpNeededToLevelUp = guildDetails.player.detailed_xp[1];
          var totalXP = guildDetails.player.detailed_xp[0];

          console.log(`Earned ${earnedXP} xp from message.`);

          chrome.tabs.sendMessage(tab.id || 0, {
            op: `xp_earned`,
            d: earnedXP,
            level_percentage: `${Math.floor(
              (totalXP / xpNeededToLevelUp) * 100
            )}%`,
            current_level: guildDetails.player.level,
          });

          // Start 1 minute timer
          chrome.tabs.sendMessage(tab.id || 0, {
            op: `start_timer`,
            d: 60,
            channel_id: tabDetails[3],
          });
        } else {
          console.log(`No xp earned from message.`);
        }

        currentData[guildID] = guildDetails.player;
      });
    });
  },
  {
    urls: [config.discord.urlPattern],
  },
  []
);
