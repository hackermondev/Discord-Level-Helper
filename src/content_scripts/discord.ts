console.log(`Hello world from Discord Level Up Helper!`);

var lastDOMMessageAdded: HTMLDivElement | null = null;
var timer: any = {};

chrome.runtime.onMessage.addListener(
  (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: Function
  ) => {
    console.log(message);

    if (message.op) {
      if (message.op == `xp_earned`) {
        var br = document.createElement(`br`);

        lastDOMMessageAdded?.appendChild(br);
        lastDOMMessageAdded?.appendChild(br);

        var text = document.createElement(`i`);

        text.style.color = `gray`;
        text.innerText = `You earned ${message.d} xp from this message. You are ${message["level_percentage"]} done with level ${message["current_level"]}.`;

        lastDOMMessageAdded?.appendChild(text);
      }

      if (message.op == `level_earned`) {
        var br = document.createElement(`br`);

        lastDOMMessageAdded?.appendChild(br);
        lastDOMMessageAdded?.appendChild(br);

        var text = document.createElement(`i`);

        text.style.color = `gray`;
        text.innerText = `You earned ${message.d} level(s) from this message.`;

        lastDOMMessageAdded?.appendChild(text);
      }

      if (message.op == `start_timer`) {
        if (timer[message.channel_id]) {
          return;
        }

        var textarea = document.querySelectorAll("[class*=textArea]");

        if (!textarea[0]) {
          return;
        }

        var input: any = textarea[0].children[0];

        var originaltext: string | null = null;

        if (!input) {
          originaltext = `???`;
        } else {
          originaltext = input.innerText;
        }

        var timerEnd = new Date().getTime() + message.d * 1000;

        timer[message["channel_id"]] = setInterval(() => {
          var current = new Date().getTime();

          var textarea = document.querySelectorAll("[class*=textArea]");

          if (!textarea[0]) {
            return;
          }

          var currentChannelID = location.pathname.split("/")[3];
          var input: any = textarea[0].children[0];

          if (input.getAttribute(`role`) == `textbox`) {
            input = undefined;
          }

          if (currentChannelID != message["channel_id"]) {
            return;
          }

          if (current > timerEnd) {
            if (input) {
              input.innerText = originaltext;
            }

            clearInterval(timer[message["channel_id"]]);
            delete timer[message["channel_id"]];

            return;
          }

          var remaining = timerEnd - current;

          var secondsRemaning = Math.floor(remaining / 1000);

          if (input) {
            input.innerText = `${originaltext} (0:${secondsRemaning})`;
          }
        }, 100);
      }
    }
  }
);

// Detect when a new message is added
let oberserver = new MutationObserver((mutations: MutationRecord[]) => {
  for (let mutation of mutations) {
    for (let addedNodes of mutation.addedNodes) {
      var node: any = addedNodes;

      if (node.id && node.id.startsWith(`chat-messages-`)) {
        lastDOMMessageAdded = node;
      }
    }
  }
});

oberserver.observe(document, { childList: true, subtree: true });
