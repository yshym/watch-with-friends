import AlertMessage from "./AlertMessage";
import { selectedText, selectedValue } from "./selectTools";

const roomNameInput = document.getElementsByTagName("select")[0];
const roomNameSubmitButton = document.getElementById("room-name-submit");
const container = <HTMLElement>document.getElementsByClassName("container-xl")[0];

roomNameSubmitButton.onclick = _e => {
    let roomName = selectedText(roomNameInput);
    let roomValue = selectedValue(roomNameInput);
    if (roomName.trim()) {
        window.location.pathname = `/${roomValue}/`;
    } else {
        let alertMessage = new AlertMessage(
            container,
            "Input the name of the room you want to enter!",
            "warning"
        );
        alertMessage.post();
    }
};
