import Plyr from "plyr";

type VideoEventName = "pause" | "play" | "seeked" | "statechange";
type VideoEventHandler = (e: any) => void;
export type VideoEventHandlers = {
    [eventName in VideoEventName]: VideoEventHandler;
};

export const buildHandlers = (
    video: Plyr,
    roomSocket: WebSocket
): VideoEventHandlers => ({
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

export const enableEvents = (video: Plyr, handlers: VideoEventHandlers) => {
    for (var e in handlers) {
        video.on(<VideoEventName>e, handlers[<VideoEventName>e]);
    }
};

export const disableEvents = (video: Plyr, handlers: VideoEventHandlers) => {
    for (var e in handlers) {
        video.off(<VideoEventName>e, handlers[<VideoEventName>e]);
    }
};

export const withoutHandlers = (
    video: Plyr,
    name: VideoEventName,
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

// Initialize Plyr player
export const initializeVideo = () => {
    let controls = [
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
    let clickToPlay = true;

    const video = new Plyr("#video-active", {
        controls: controls,
        clickToPlay: clickToPlay,
        fullscreen: {
            enabled: true,
        },
    });

    return video;
};
