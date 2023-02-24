let connectBtn = document.getElementById("connect");
let invitations = document.getElementById("invitations");

chrome.storage.sync.set({ invites: 0 });

let interval = setInterval(() => {
  chrome.storage.sync.get("invites", ({ invites }) => {
    if (invites) {
      invitations.innerHTML = invites;
      console.log("Invites:: ", invites);
    } else {
      connectBtn.ariaBusy = "false";
      connectBtn.innerHTML = "Connect";
    }
  });
}, 1000);

// Run on click
connectBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Find current tab

  connectBtn.ariaBusy = "true";
  connectBtn.innerHTML = "Inviting...";

  chrome.scripting.executeScript({
    // Run the following script on our tab
    target: { tabId: tab.id },
    function: () => {
      let elems = document.querySelectorAll(
        "button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view"
      );

      // Connect handler function
      const handleConnect = (i) => {
        setTimeout(() => {
          elems[i]?.click();
          console.log("Clicked Connect!");

          setTimeout(() => {
            let send = document.querySelector(
              "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1"
            );

            if (send) {
              send?.click();
              console.log("Clicked send!");
              chrome.storage.sync.set({ invites: i + 1 });
            }

            if (i + 1 < elems.length) {
              handleConnect(i + 1);
            } else {
              chrome.storage.sync.set({ invites: 0 });
            }
          }, 500);
        }, 1000);
      };

      // Start connecting
      handleConnect(0);
    },
  });
});
