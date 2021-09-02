import { getElementTextContent } from "../documentTools";
import { RoomSocket } from "./websockets";
import { initializeVideo } from "./video";
import AlertMessage from "./AlertMessage";
import { initializeChat } from "./chat";
import { initializeRoomNameChangeForm } from "./nameChangeForm";
import { initializeVideoChangeForm } from "./videoChangeForm";
import { initializeVideoElements, initializeLocalVideo } from "./localVideo";
import RecentlyVisitedRooms from "./RecentlyVisitedRooms";

declare global {
    interface HTMLElement {
        removeChildren(): HTMLElement;
    }
}

// Remove all children of the element
HTMLElement.prototype.removeChildren = function (): HTMLElement {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }

    return this;
};

// Declare variables from DTL text_script tags
const [roomId, roomName, roomAuthor, user, videoURL] = [
    getElementTextContent("roomId") || "",
    getElementTextContent("roomName") || "",
    getElementTextContent("roomAuthorUsername") || "",
    getElementTextContent("currentUserUsername") || "",
    getElementTextContent("videoURL") || "",
];

// Get necessary DOM elements
const container = <HTMLElement>(
    document.getElementsByClassName("container-xl")[0]
);
const copyURLButton = document.getElementById("copy-url");

// Remove alert message
AlertMessage.removeFrom(container);

if (copyURLButton) {
    copyURLButton.onclick = (_e) => {
        navigator.clipboard.writeText(window.location.href);
        let alertMessage = new AlertMessage(
            container,
            "Current URL was copied to the clipboard",
            "success"
        );
        alertMessage.mount();
    };
}

// Initialize video player
const video = initializeVideo();

// Initialize room websocket
const roomSocket = new RoomSocket(roomId, roomAuthor, user, video);

initializeChat(roomSocket);

// Show room change forms on button clicks
if (roomAuthor === user) {
    initializeRoomNameChangeForm();
    initializeVideoChangeForm();
}

if (videoURL) {
    initializeLocalVideo(videoURL);
} else {
    initializeVideoElements();
}

RecentlyVisitedRooms.onRoomVisit(roomName, window.location.href);
