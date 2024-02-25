const enableTrollCheckElement = document.getElementById("enableTrollCheck");
const timeoutTrollCheckElement = document.getElementById("timeoutTrollCheck");

enableTrollCheckElement.addEventListener('change', (event) => {
    chrome.storage.sync.set({ enableTrollCheck: event.currentTarget.checked });
});

timeoutTrollCheckElement.addEventListener('change', (event) => {
    chrome.storage.sync.set({ timeoutTrollCheck: event.currentTarget.value });
});

window.addEventListener("load", function(){
    chrome.storage.sync.get(['timeoutTrollCheck', 'enableTrollCheck'], function(data) {
        if (data.timeoutTrollCheck !== undefined) {
            timeoutTrollCheckElement.value = data.timeoutTrollCheck;
        }
        if (data.enableTrollCheck !== undefined) {
            enableTrollCheckElement.checked = data.enableTrollCheck;
        }
    });
});