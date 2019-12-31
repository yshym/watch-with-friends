// Initialize Plyr player
if (user === roomAuthor) {
    var controls = [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "airplay",
        "fullscreen",
    ]
    var clickToPlay = true
} else {
    var controls = [
        "current-time",
        "mute",
        "volume",
        "captions",
        "airplay",
        "fullscreen",
    ]
    var clickToPlay = false
}

// FIXME Video occupies full RAM
export const video = new Plyr("#video-active", {
    controls: controls,
    clickToPlay: clickToPlay,
    fullscreen: {iosNative: true},
    youtube: {
        cc_load_policy: 3,
        playsinline: true,
    }
})

