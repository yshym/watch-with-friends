const nameInput = document.querySelector("#id_name");
const videoTypeSelectElement = document.querySelector("#id_video_type")
const divIdVideo = document.querySelector("#div_id_video")
const divIdYoutubeLink = document.querySelector("#div_id_youtube_link")

function getSelectedText(selectElement) {
    return selectElement.options[selectElement.selectedIndex].value
}

let showVideoField = () => {
    let selectedText = getSelectedText(videoTypeSelectElement)
    if (selectedText === "local" ) {
        divIdYoutubeLink.style.display = "none"
        divIdVideo.style.display = "block"
    } else if (selectedText === "yt" ) {
        divIdVideo.style.display = "none"
        divIdYoutubeLink.style.display = "block"
    }
}

nameInput.focus();

showVideoField()
videoTypeSelectElement.onchange = showVideoField
