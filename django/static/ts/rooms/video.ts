import Plyr from "plyr";

// Initialize Plyr player
let controls: string[], clickToPlay: boolean;

type eventName = "pause" | "play" | "seeked" | "statechange";

export const buildHandlers = (
    video: Plyr,
    videoURL: string,
    roomSocket: WebSocket
) => ({
    pause: (_e: any) =>
        roomSocket.send(
            JSON.stringify({
                type: "pause_video",
                currentTime: video.currentTime,
            })
        ),
    play: (_e: any) => roomSocket.send(JSON.stringify({ type: "play_video" })),
    seeked: (_e: any) => {
        roomSocket.send(
            JSON.stringify({
                type: "seeked_video",
                currentTime: video.currentTime,
            })
        );
        if (videoURL) {
            // video.pause();
            // setTimeout(() => video.play(), 1000);
        }
    },
    // Change state of the yt video player event
    statechange: (e: any) => {
        const bufferingCode = 3;
        const bufferedCodes = new Set([-1, 1, 2]);

        if (e.detail.code === bufferingCode) {
            roomSocket.send(JSON.stringify({ type: "buffering_video" }));
        } else if (bufferedCodes.has(e.detail.code)) {
            roomSocket.send(JSON.stringify({ type: "buffered_video" }));
        }
    },
});

export const enableEvents = (video: Plyr, handlers: any) => {
    for (var e in handlers) {
        video.on(e as eventName, handlers[e as eventName]);
    }
};

export const disableEvents = (video: Plyr, handlers: any) => {
    for (var e in handlers) {
        video.off(e as eventName, handlers[e as eventName]);
    }
};

export const withoutHandlers = (
    video: Plyr,
    name: eventName,
    handlers: any,
    callback: () => void,
    skipNext: boolean = false
) => {
    if (name in handlers) {
        video.off(name, handlers[name]);
        callback();
        const bindHandler = () => video.on(name, handlers[name]);
        if (skipNext) {
            video.once(name, bindHandler);
        } else {
            bindHandler();
        }
    } else {
        callback();
    }
};

export const initializeVideo = () => {
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

    const video = new Plyr("#video-active", {
        controls: controls,
        clickToPlay: clickToPlay,
        fullscreen: {
            enabled: true,
        },
    });

    return video;
};
