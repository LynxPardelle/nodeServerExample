"use strict";
const [http, fs, path, mimetypes] = [
  require("http"),
  require("fs"),
  require("path"),
  {
    html: "text/html",
    js: "text/javascript",
    css: "text/css",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    svg: "image/svg+xml",
    wav: "audio/wav",
    mp4: "video/mp4",
    woff: "application/font-woff",
    ttf: "application/font-ttf",
    eot: "application/vnd.ms-fontobject",
    otf: "application/font-otf",
    wasm: "application/wasm",
  },
];
let https, server;
try {
  https = require("node:https");
  server = https.createServer({
    key: fs.readFileSync("./ssl/privatekey.pem"),
    cert: fs.readFileSync("./ssl/certificate.pem"),
  });
} catch (err) {
  server = http.createServer();
  console.log("https support is disabled!");
}

server.addListener("request", (req, res) => {
  if (req.url === "" || req.url === "/") {
    req.url = "index.html";
  }

  if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World From /api\n");
  } else {
    fs.readFile(__dirname + "/" + req.url, (error, content) => {
      if (error) {
        console.log("Error: " + error);
        fs.readFile(__dirname + "/404.html", (e, errorContent) => {
          if (e) {
            console.log("Error: " + e);
          } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.write(errorContent);
          }
          res.end();
        });
      } else {
        res.writeHead(200, {
          "Content-Type": mimetypes[path.extname(req.url).split(".")[1]],
        });
        res.write(content);
        res.end();
      }
    });
  }
});
server.listen(6789, () => {
  console.log(`Server running at http://localhost:6789/`);
});
