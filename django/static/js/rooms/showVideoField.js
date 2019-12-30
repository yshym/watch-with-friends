import {selectedText} from "./selectTools"


export default function showVideoField() {
    let videoTypeSelectElement = document.getElementById("id_video_type")
    let divIdVideo = document.getElementById("div_id_video")
    let divIdYoutubeLink = document.getElementById("div_id_youtube_link")

    let videoType = selectedText(videoTypeSelectElement)

    switch(videoType) {
        case "local":
            divIdYoutubeLink.style.display = "none"
            divIdVideo.style.display = "block"
            break
        case "yt":
            divIdVideo.style.display = "none"
            divIdYoutubeLink.style.display = "block"
    }
}
