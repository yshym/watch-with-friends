import showVideoField from "./showVideoField"


nameInput = document.getElementById "id_name"
videoTypeSelectElement = document.getElementById "id_video_type"

nameInput.focus()

showVideoField()
videoTypeSelectElement.onchange = showVideoField
