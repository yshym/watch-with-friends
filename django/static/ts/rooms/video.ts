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
            iosNative: true,
        },
        youtube: {
            cc_load_policy: 3,
            playsinline: true,
        },
    });

    return video;
}
