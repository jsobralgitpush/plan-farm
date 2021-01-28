var webview = document.getElementsByClassName("click")[0];

webview.addEventListener("dom-ready", function() {
  // Show devTools if you want
  //webview.openDevTools();
  console.log("DOM-Ready, triggering events !");
  
  // Aler the scripts src of the website from the <webview>
  webview.send("request");
  
  // alert-something
  webview.send("alert-something", "Hey, i'm alerting this.");
  
  // change-text-element manipulating the DOM
  webview.send("change-text-element",{
      id: "myelementID",
      text: "My text"
  });
});
