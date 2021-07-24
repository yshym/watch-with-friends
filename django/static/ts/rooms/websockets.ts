import Plyr from "plyr";
import ChatMessage from "./ChatMessage";
import ConnectedUser from "./ConnectedUser";
import { buildHandlers, enableEvents, withoutHandlers } from "./video";

// Initialize WebSocket
export function initializeRoomSocket(
    roomName: string,
    roomAuthor: string,
    user: string,
    video: Plyr,
    videoURL: string
): WebSocket {
    const roomSocket = new WebSocket(
        `ws://${window.location.host}/ws/room/${roomName}/`
    );

    const container = <HTMLElement>(
        document.getElementsByClassName("container-xl")[0]
    );
    const chatLogBody = document.getElementById("chat-log-body");
    const connectedUsersContainer = document.getElementById("connectedUsers");

    function notNewUserWarningElement(text: string): Element {
        let warningH1 = document.createElement("h1");

        let surpriseIcon = document.createElement("i");
        surpriseIcon.className = "far fa-surprise";

        let warningText = document.createTextNode(" " + text);

        warningH1.appendChild(surpriseIcon);
        warningH1.appendChild(warningText);

        return warningH1;
    }

    // Enable HTML5 video events
    const handlers = buildHandlers(video, videoURL, roomSocket);
    enableEvents(video, handlers);

    roomSocket.onmessage = (e: any) => {
        let data = JSON.parse(e.data);
        let messageType = data.type;
        let username = data.username;

        // general messages
        switch (messageType) {
            case "message": {
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
                            connectedUser.addToContainer(
                                <HTMLElement>connectedUsersContainer
                            );
                        });
                    }
                } else if (user === username) {
                    container.removeChildren();

                    container.appendChild(
                        notNewUserWarningElement(
                            "You are already in this room from the other tab/browser"
                        )
                    );
                }

                break;
            }
        }

        switch (messageType) {
            case "buffering_video": {
                withoutHandlers(video, "pause", handlers, () => video.pause());
                break;
            }
            case "all_players_buffered": {
                withoutHandlers(video, "play", handlers, () => video.play());
                break;
            }
        }

        if (username && username === user) {
            return;
        }

        // video messages
        switch (messageType) {
            case "seeked_video": {
                withoutHandlers(
                    video,
                    "seeked",
                    handlers,
                    () => (video.currentTime = data.current_time),
                    true
                );
                break;
            }
            case "pause_video": {
                withoutHandlers(video, "pause", handlers, () => video.pause());
                withoutHandlers(
                    video,
                    "seeked",
                    handlers,
                    () => (video.currentTime = data.current_time),
                    true
                );
                break;
            }
            case "play_video": {
                withoutHandlers(video, "play", handlers, () => video.play());
                break;
            }
        }
    };

    roomSocket.onclose = (_e) =>
        console.error("Room socket closed unexpectedly");

    return roomSocket;
}
