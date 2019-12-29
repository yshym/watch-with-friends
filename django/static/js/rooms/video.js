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

export const video = new Plyr("#video-active", {
    controls: controls,
    clickToPlay: clickToPlay,
})

