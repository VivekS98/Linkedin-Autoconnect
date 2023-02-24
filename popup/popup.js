let connectBtn = document.getElementById("connect");
let invitations = document.getElementById("invitations");

chrome.storage.sync.set({ invites: 0 });

setInterval(() => {
  chrome.storage.sync.get("invites", ({ invites }) => {
    if (invites) {
      invitations.innerHTML = invites - 2;
      console.log("Invites:: ", invites);
    }
  });

  chrome.storage.sync.get("inviting", ({ inviting }) => {
    if (inviting) {
      connectBtn.ariaBusy = "true";
      connectBtn.innerHTML = "Inviting...";
    } else {
      connectBtn.ariaBusy = "false";
      connectBtn.innerHTML = "Connect";
    }
  });

}, 500);

// Run on click
connectBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Find current tab

  chrome.storage.sync.set({ inviting: true });

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
              chrome.storage.sync.set({ inviting: false });
            }
          }, 500);
        }, 1000);
      };

      // Start connecting
      handleConnect(0);
    },
  });
});
