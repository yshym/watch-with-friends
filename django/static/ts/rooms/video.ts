import Plyr from "plyr";

// Initialize Plyr player
let controls: string[], clickToPlay: boolean;

export function initializeVideo(user: string, roomAuthor: string) {
    if (user == roomAuthor) {
        controls = [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "airplay",
            "fullscreen",
        ];
        clickToPlay = true;
    } else {
        controls = [
            "current-time",
            "mute",
            "volume",
            "captions",
            "airplay",
            "fullscreen",
        ];
        clickToPlay = false;
    }

    const video = new Plyr("#video-active", {
        controls: controls,
        clickToPlay: clickToPlay,
        fullscreen: {
            enabled: true,
        },
    });

    return video;
}
