function URLExists(url: string): boolean {
    let http = new XMLHttpRequest();
    http.open("HEAD", url, false);
    http.send();
    return http.status != 404;
}

function waitForHLSFile(url: string): any {
    if (URLExists(url)) {
        (self as any).postMessage("m3u8 file was created.");
    } else {
        setTimeout(waitForHLSFile(url), 1000);
    }
}

self.addEventListener("message", (e): void =>
    waitForHLSFile(`${e.data.videoName}.m3u8`)
);
