const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);
console.log(window.location.host)

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-other'>` + data.message + '</div><br><br>');
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    console.log('message:' + message)
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-me'>` + message + '</div><br><br>');
    messageInputDom.value = '';
};