import Hls from "hls.js";

export const initializeVideoElements = () => {
    const videoDiv = document.getElementById("video-player");
    const roomVideoChangeButton = document.getElementById(
        "room-video-change-form-show"
    );
    const videoSpinner = document.getElementById("video-spinner");

    if (videoDiv && videoSpinner) {
        videoSpinner.style.display = "none";
        videoDiv.style.display = "block";
        if (roomVideoChangeButton) {
            roomVideoChangeButton.style.display = "block";
        }
    }
};

// Load m3u8 file into player
export const initializeLocalVideo = (videoURL: string) => {
    const videoElement = document.getElementById("video-active");

    let hls = new Hls();
    let HLSFileWaiter = new Worker("/static/bundles/HLSFileWaiter.js");

    let videoName = videoURL.split(".")[0];
    HLSFileWaiter.addEventListener("message", (_e) => {
        hls.loadSource(`${videoName}.m3u8`);
        videoElement && hls.attachMedia(<HTMLVideoElement>videoElement);

        initializeVideoElements();
    });

    HLSFileWaiter.postMessage({ videoName });
};
