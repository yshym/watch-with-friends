URLExists = (url) ->
    http = new XMLHttpRequest()
    http.open "HEAD", url, false
    http.send()
    http.status != 404

waitForHLSFile = (url) ->
    if URLExists url
        self.postMessage("m3u8 file was created.")
    else
        setTimeout waitForHLSFile(url), 1000

self.addEventListener "message", (e) ->
    waitForHLSFile "#{e.data.videoName}.m3u8"
