import { selectedValue } from "./selectTools";

const showVideoField = () => {
    const videoTypeSelectElement = document.getElementById("id_video_type");
    const divIdVideo = document.getElementById("div_id_video");
    const divIdYoutubeLink = document.getElementById("div_id_youtube_link");

    const videoType = selectedValue(<HTMLSelectElement>videoTypeSelectElement);

    if (divIdVideo && divIdYoutubeLink) {
        switch (videoType) {
            case "local": {
                divIdYoutubeLink.style.display = "none";
                divIdVideo.style.display = "block";

                break;
            }
            case "yt": {
                divIdVideo.style.display = "none";
                divIdYoutubeLink.style.display = "block";

                break;
            }
        }
    }
};

export default showVideoField;
