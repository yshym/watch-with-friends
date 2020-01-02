import AlertMessage from "./AlertMessage"
import {selectedText, selectedValue} from "./selectTools"


roomNameInput = document.getElementsByTagName("select")[0]
roomNameSubmitButton = document.getElementById "room-name-submit"
container = document.getElementsByClassName("container-xl")[0]

roomNameSubmitButton.onclick = (_e) ->
    roomName = selectedText roomNameInput
    roomValue = selectedValue roomNameInput
    if roomName.trim()
        window.location.pathname = "/#{roomValue}/"
    else
        alertMessage = new AlertMessage(
            container,
            "Input the name of the room you want to enter!",
            "warning",
        )
        alertMessage.post()
