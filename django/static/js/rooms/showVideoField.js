function getSelectedText(selectElement) {
    return selectElement.options[selectElement.selectedIndex].value
}

export default function showVideoField() {
    let videoTypeSelectElement = document.getElementById("id_video_type")
    let divIdVideo = document.getElementById("div_id_video")
    let divIdYoutubeLink = document.getElementById("div_id_youtube_link")

    let selectedText = getSelectedText(videoTypeSelectElement)

    if (selectedText === "local" ) {
        divIdYoutubeLink.style.display = "none"
        divIdVideo.style.display = "block"
    } else if (selectedText === "yt" ) {
        divIdVideo.style.display = "none"
        divIdYoutubeLink.style.display = "block"
    }
}
