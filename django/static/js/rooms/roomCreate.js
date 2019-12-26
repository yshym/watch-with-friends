import showVideoField from "./showVideoField"


const nameInput = document.querySelector("#id_name")
const videoTypeSelectElement = document.querySelector("#id_video_type")

nameInput.focus()

showVideoField()
videoTypeSelectElement.onchange = showVideoField
