// Fetches user info from the API
function getUserInfo(userId) {
    const req = {
        Type: "GET_USER_BY_ID",
        Arguments: [userId]
    };

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(req, resolve);
    });
}

// Checks if an element has a child element with a specific id
function hasElement(element, id) {
    return Array.from(element.childNodes).some(node => node.id === id);
}

// Creates interval to mark trolls and suspicious users
function createInterval(timeout) {
    return setInterval(async function() {
        const users = document.querySelectorAll(".atm-user-name");
        for (const user of users) {
            const parent = user.parentElement;
            
            if (!parent.hasAttribute('href') && !hasElement(parent.parentElement, 'troll-checked')) continue;
            
            const id = parent.href.split('/profil/')[1];
            let userInfo = await getUserInfo(id);

            const trollElement = document.createElement("p");
            trollElement.id = "troll-checked";
            if (userInfo["Success"] && userInfo["Data"]["IsTroll"] && !hasElement(parent.parentElement, 'troll-checked')) {
                trollElement.style = "background-color: #FF4760;color: white; border-radius: 50px;padding: 2.25px 8px 0px 8px;font-size: 9px;margin-left: 2px;font-weight: 1000;font-family: monospace;";
                trollElement.innerText = "Troll";
            } else if (userInfo["Success"] && userInfo["Data"]["IsSus"] && !hasElement(parent.parentElement, 'troll-checked')) {
                trollElement.style = "background-color: #FFB447;color: black; border-radius: 50px;padding: 2.25px 8px 0px 8px;font-size: 9px;margin-left: 2px;font-weight: 1000;font-family: monospace;";
                trollElement.innerText = "Sus";
            }
            parent.parentElement.appendChild(trollElement);
        }
    }, timeout);
}

// Variables initialization
let timeout = 5000;
let isTimeoutRefreshed = false;
let isRedirectEnabled = false;
let checkInterval = null;

// Syncs storage
function syncStorage() {
    chrome.storage.sync.get(['timeoutTrollCheck', 'enableTrollCheck'], ({ timeoutTrollCheck, enableTrollCheck }) => {
        if (timeoutTrollCheck !== undefined && timeoutTrollCheck !== timeout) {
            isTimeoutRefreshed = true;
            timeout = timeoutTrollCheck;
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = createInterval(timeout);
            }
        }
        isRedirectEnabled = !!enableTrollCheck;
    });
}

// Listen for storage changes
chrome.storage.sync.onChanged.addListener(syncStorage);

// Initial sync
syncStorage();

// Main loop
setInterval(() => {
    if (isTimeoutRefreshed && checkInterval) {
        isTimeoutRefreshed = false;
        clearInterval(checkInterval);
        checkInterval = null;
    }

    const isInDiscussion = document.URL.includes("https://diskuze.seznam.cz/");
    const isDiscussionWithRedirect = document.URL.includes("https://www.novinky.cz/diskuze/") || document.URL.includes("https://www.seznamzpravy.cz/diskuze/");
    if (isInDiscussion && !checkInterval) {
        checkInterval = createInterval(timeout);
    }

    if (isDiscussionWithRedirect && isRedirectEnabled) {
        const iframe = document.querySelector("main iframe");
        if (iframe) {
            window.location.replace(iframe.src);
        }
    }
}, 5000);