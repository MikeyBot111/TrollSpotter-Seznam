const apiEndpoint = "https://mikeysnest.dev/api/v1/anti-kreml-seznam";

function getUserById(userId) {
    const params = new URLSearchParams({ key: "jhrZOMCiCpM7yoHPjqA5VgiseCIKJ8xE", id: userId });
    const url = `${apiEndpoint}/getuserbyid?${params}`;

    return fetch(url)
        .then(response => response.json())
        .catch(err => console.error(err));
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch(msg.Type) {
        case "GET_USER_BY_ID":
            getUserById(msg.Arguments[0]).then(sendResponse);
            break;
        default:
            sendResponse("Error")
    }
    return true;
});