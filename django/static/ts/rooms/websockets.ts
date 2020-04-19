import ChatMessage from "./ChatMessage";
import ConnectedUser from "./ConnectedUser";

// Initialize WebSocket
export function initializeRoomSocket(
    roomName: string,
    roomAuthor: string,
    user: string,
    video: any
): WebSocket {
    const roomSocket = new WebSocket(
        `ws://${window.location.host}/ws/chat/${roomName}/`
    );

    let container = <HTMLElement>(
        document.getElementsByClassName("container-xl")[0]
    );
    let chatLogBody = document.getElementById("chat-log-body");
    let connectedUsersContainer = document.getElementById("connectedUsers");

    function notNewUserWarningElement(text: string): Element {
        let warningH1 = document.createElement("h1");

        let surpriseIcon = document.createElement("i");
        surpriseIcon.className = "far fa-surprise";

        let warningText = document.createTextNode(" " + text);

        warningH1.appendChild(surpriseIcon);
        warningH1.appendChild(warningText);

        return warningH1;
    }

    roomSocket.onmessage = (e: any) => {
        let data = JSON.parse(e.data);
        let messageType = data.type;

        // Messages for all users
        switch (messageType) {
            case "message": {
                let username = data.username;
                let content = data.message;

                if (chatLogBody) {
                    let message = new ChatMessage(
                        chatLogBody,
                        username,
                        content,
                        user
                    );

                    message.post();

                    chatLogBody.scrollTop = chatLogBody.scrollHeight;
                }

                break;
            }
            case "user_connected":
            case "user_disconnected": {
                let usernameData = data.username;
                let isNewUserData = data.is_new_user;

                if (isNewUserData || messageType == "user_disconnected") {
                    let connectedUsersDataSet = new Set(
                        data.connected_users.split(",")
                    );

                    if (connectedUsersContainer) {
                        connectedUsersContainer.removeChildren();

                        connectedUsersDataSet.forEach((username) => {
                            let connectedUser = new ConnectedUser(
                                <string>username,
                                roomAuthor
                            );
                            connectedUser.addToContainer(<HTMLElement>connectedUsersContainer);
                        });
                    }
                } else if (user == usernameData) {
                    container.removeChildren();

                    container.appendChild(
                        notNewUserWarningElement(
                            "You are already in this room from the other tab/browser"
                        )
                    );
                }

                break;
            }
            case "buffering_video": {
                video.pause();

                break;
            }
            case "all_players_buffered": {
                video.play();

                break;
            }
        }
        // Messages for all users, except the room creator
        if (user != roomAuthor) {
            switch (messageType) {
                case "seeked_video": {
                    video.currentTime = data.current_time;

                    break;
                }
                case "pause_video": {
                    video.pause();

                    break;
                }
                case "play_video": {
                    video.play();

                    break;
                }
            }
        }
    };

    return roomSocket;
}
