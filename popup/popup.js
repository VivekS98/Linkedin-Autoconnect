let connectBtn = document.getElementById("connect");
let invitations = document.getElementById("invitations");

// Set our button's color to the color that we stored
chrome.storage.sync.get("color", ({ color }) => {
  connectBtn.style.backgroundColor = color
});

var incrementInvitations = (i) => {
  invitations.innerHTML = i;
}

// Run on click
connectBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }) // Find current tab

  connectBtn.ariaBusy = "true"
  connectBtn.innerHTML = "Inviting..."
  chrome.scripting.executeScript({ // Run the following script on our tab
    target: { tabId: tab.id },
    function: () => {
      let elems = document.querySelectorAll("button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view"); // Grab every element in the dom

      const handleConnect = (i) => {
        elems[i]?.click();
        console.log("Clicked Connect!");

        setTimeout(() => {
          let send = document.querySelector('button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
          if (send) {
            send?.click();
            console.log("Clicked send!");
            incrementInvitations(i + 1);
          }
          if (i + 1 < elems.length) {
            setTimeout(() => {
              handleConnect(i + 1);
            }, 300);
          }
        }, 300);
      }

      handleConnect(0);
    }
  });
  connectBtn.ariaBusy = null;
})
