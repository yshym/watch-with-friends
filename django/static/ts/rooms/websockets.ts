import Plyr from "plyr";
import ChatMessage from "./ChatMessage";
import ConnectedUser from "./ConnectedUser";
import { buildHandlers, enableEvents, withoutHandlers } from "./video";

function notNewUserWarningElement(text: string): Element {
    let warningH1 = document.createElement("h1");

    let surpriseIcon = document.createElement("i");
    surpriseIcon.className = "far fa-surprise";

    let warningText = document.createTextNode(" " + text);

    warningH1.appendChild(surpriseIcon);
    warningH1.appendChild(warningText);

    return warningH1;
}

type WebSocketMessageCallback = (data: Object) => void;

export class RoomSocket {
    socket: WebSocket;
    video: Plyr;
    roomAuthor: string;
    user: string;
    handlers: Object;
    container: HTMLElement;
    chatLogBody: HTMLElement;
    connectedUsersContainer: HTMLElement;

    constructor(
        roomName: string,
        roomAuthor: string,
        user: string,
        video: Plyr,
        videoURL: string
    ) {
        this.roomAuthor = roomAuthor;
        this.user = user;
        this.video = video;

        this.socket = new WebSocket(
            `ws://${window.location.host}/ws/room/${roomName}/`
        );

        this.getElements();

        // Enable HTML5 video events
        this.handlers = buildHandlers(video, videoURL, this.socket);
        enableEvents(video, this.handlers);

        this.initializeHandlers();
    }

    getElements = (): void => {
        this.container = <HTMLElement>(
            document.getElementsByClassName("container-xl")[0]
        );
        this.chatLogBody = <HTMLElement>(
            document.getElementById("chat-log-body")
        );
        this.connectedUsersContainer = <HTMLElement>(
            document.getElementById("connectedUsers")
        );
    };

    onChatMessage: WebSocketMessageCallback = (data: Object): void => {
        const content = <string>data.message;
        const username = <string>data.username;

        if (this.chatLogBody) {
            let chatMessage = new ChatMessage(
                this.chatLogBody,
                username,
                content,
                this.user
            );

            chatMessage.post();

            this.chatLogBody.scrollTop = this.chatLogBody.scrollHeight;
        }
    };

    onUserConnected: WebSocketMessageCallback = (data: Object): void => {
        let isNewUserData = data.is_new_user;

        if (isNewUserData || data.type == "user_disconnected") {
            let connectedUsersDataSet = new Set(
                (data.connected_users as string).split(",")
            );

            if (this.connectedUsersContainer) {
                this.connectedUsersContainer.removeChildren();

                connectedUsersDataSet.forEach((username) => {
                    let connectedUser = new ConnectedUser(
                        <string>username,
                        this.roomAuthor
                    );
                    connectedUser.addToContainer(this.connectedUsersContainer);
                });
            }
        } else if (this.user === <string>data.username) {
            this.container.removeChildren();

            this.container.appendChild(
                notNewUserWarningElement(
                    "You are already in this room from the other tab/browser"
                )
            );
        }
    };

    onBufferingVideo: WebSocketMessageCallback = (_data: Object): void => {
        withoutHandlers(this.video, "pause", this.handlers, () =>
            this.video.pause()
        );
    };

    onAllPlayersBuffered: WebSocketMessageCallback = (_data: Object): void => {
        withoutHandlers(this.video, "play", this.handlers, () =>
            this.video.play()
        );
    };

    onSeekedVideo: WebSocketMessageCallback = (data: Object): void => {
        withoutHandlers(
            this.video,
            "seeked",
            this.handlers,
            () => (this.video.currentTime = <number>data.current_time),
            true
        );
    };

    onPauseVideo: WebSocketMessageCallback = (data: Object): void => {
        withoutHandlers(this.video, "pause", this.handlers, () =>
            this.video.pause()
        );
        withoutHandlers(
            this.video,
            "seeked",
            this.handlers,
            () => (this.video.currentTime = <number>data.current_time),
            true
        );
    };

    onPlayVideo: WebSocketMessageCallback = (_data: Object): void => {
        withoutHandlers(this.video, "play", this.handlers, () =>
            this.video.play()
        );
    };

    initializeHandlers = (): void => {
        this.socket.onmessage = (e: any) => {
            let data = JSON.parse(e.data);
            let messageType = data.type;
            let username = data.username;

            // general messages
            switch (messageType) {
                case "message": {
                    this.onChatMessage(data);
                    break;
                }
                case "user_connected":
                case "user_disconnected": {
                    this.onUserConnected(data);
                    break;
                }
                case "buffering_video": {
                    this.onBufferingVideo(data);
                    break;
                }
                case "all_players_buffered": {
                    this.onAllPlayersBuffered(data);
                    break;
                }
            }

            if (username && username === this.user) {
                return;
            }
            console.log(
                `websocket message to ${this.user}: ${JSON.stringify(data)}`
            );

            // video messages
            switch (messageType) {
                case "seeked_video": {
                    this.onSeekedVideo(data);
                    break;
                }
                case "pause_video": {
                    this.onPauseVideo(data);
                    break;
                }
                case "play_video": {
                    this.onPlayVideo(data);
                    break;
                }
            }
        };

        this.socket.onclose = (_e) =>
            console.error("Room socket closed unexpectedly");
    };
}
