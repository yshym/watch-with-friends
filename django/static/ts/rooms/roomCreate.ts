import showVideoField from "./showVideoField";

const nameInput = document.getElementById("id_name");
const videoTypeSelectElement = document.getElementById("id_video_type");

nameInput && nameInput.focus();

showVideoField();
if (videoTypeSelectElement) {
    videoTypeSelectElement.onchange = showVideoField;
}
