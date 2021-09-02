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
    const videoElement = <HTMLVideoElement>document.getElementById("video-active");

    let HLSFileWaiter = new Worker("/static/bundles/HLSFileWaiter.js");

    let videoName = videoURL.split(".")[0];
    HLSFileWaiter.addEventListener("message", (_e) => {
        let source = `${videoName}.m3u8`;
        if (Hls.isSupported()) {
            let hls = new Hls();
            hls.loadSource(source);
            videoElement && hls.attachMedia(videoElement);
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
            videoElement.src = source;
        }

        initializeVideoElements();
    });

    HLSFileWaiter.postMessage({ videoName });
};
