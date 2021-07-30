/**
 * This file contains some functions that are shared globally between some scripts
 */

function getTabInfo(tabID: number): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabID, (tab: chrome.tabs.Tab) => {
      resolve(tab);
    });
  });
}

export default {
  getTabInfo,
};
