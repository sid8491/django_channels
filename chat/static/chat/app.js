const roomName = JSON.parse(document.getElementById('room-name').textContent);
const userName = JSON.parse(document.getElementById('username').textContent);

const chatSocket = new ReconnectingWebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onopen = function(e) {
    document.querySelector('#chat-log').innerHTML = ''
    fetchMessages();
    scrollToBottom();
  }

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.command == 'messages') {
        for (let i=data.messages.length-1; i>=0; i--) {
            if (data.messages[i]['author'] != userName) {
                document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-other'>` + data.messages[i]['message'] + '</div><br><br>');
            } else {
                document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-me'>` + data.messages[i]['message'] + '</div><br><br>');
            }
        }
    } else if (data.command == 'new_message') {
        if (data.message['author'] != userName) {
            document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-other'>` + data.message['message'] + '</div><br><br>');
        }
    }
    scrollToBottom();
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
    if (message.trim() != '') {
        chatSocket.send(JSON.stringify({
            'command': 'new_message',
            'message': message,
            'from': userName
        }));
        document.querySelector('#chat-log').innerHTML += (`<div class='chat-log-me'> ${message} </div><br><br>`);
        messageInputDom.value = '';
    }
    scrollToBottom();
};

function fetchMessages() {
    chatSocket.send(JSON.stringify({
        'command': 'load_history'
    }));
  }

function scrollToBottom() {
    document.querySelector('#chat-log').scrollTo({
        left: 0,
        top: document.querySelector('#chat-log').scrollHeight - document.querySelector('#chat-log').clientHeight,
        behavior: 'smooth'
      });
}