chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const coolApiURL = 'https://cool.ntu.edu.tw/api/v1/courses/';
    let ret = { 'errors': [{ 'message': 'Try again' }]};
    if (!(/^\d+$/.test(message.id))) {
        ret['errors'] = [{ 'message': 'invalid id' }];
    } else {
        const requesetURL = `${coolApiURL}${message.id}`;
        fetch(requesetURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ret = data;
            sendResponse(ret);
        })
    }
    return true;
})