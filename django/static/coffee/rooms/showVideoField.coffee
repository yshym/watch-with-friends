import {selectedValue} from "./selectTools"


export default showVideoField = ->
    videoTypeSelectElement = document.getElementById "id_video_type"
    divIdVideo = document.getElementById "div_id_video"
    divIdYoutubeLink = document.getElementById "div_id_youtube_link"

    videoType = selectedValue videoTypeSelectElement

    switch videoType
        when "local"
            divIdYoutubeLink.style.display = "none"
            divIdVideo.style.display = "block"
        when "yt"
            divIdVideo.style.display = "none"
            divIdYoutubeLink.style.display = "block"
