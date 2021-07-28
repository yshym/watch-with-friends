import { RoomSocket } from "./websockets";

export const initializeChat = (roomSocket: RoomSocket) => {
    const chatLogBody = document.getElementById("chat-log-body");
    const messageInput = <HTMLInputElement>(
        document.getElementById("chat-message-input")
    );
    const messageSubmitButton = document.getElementById("chat-message-submit");

    // Scroll down chat log
    if (chatLogBody) {
        chatLogBody.scrollTop = chatLogBody.scrollHeight;
    }
    // Focus chat message input
    if (messageSubmitButton) {
        messageInput.focus();
        messageInput.onkeyup = (e) => {
            if (e.keyCode === 13) {
                // enter, return
                messageSubmitButton.click();
            }
        };

        messageSubmitButton.onclick = (_e) => {
            if (messageInput.value.trim() !== "") {
                let message = messageInput.value;

                roomSocket.socket.send(
                    JSON.stringify({
                        type: "message",
                        room_name: roomSocket.roomName,
                        username: roomSocket.user,
                        message: message,
                    })
                );

                messageInput.value = "";
            }
        };
    }
};
