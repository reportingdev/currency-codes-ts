const path = require("path");
const fs = require("fs");
const axios = require("axios");

async function download(url, path) {
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function downloadIsoFile(name, path) {
  const url = `https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/${name}`;

  try {
    await download(url, path);

    console.log("Downloaded " + url + " to " + path);
  } catch (e) {
    console.error("Error downloading " + url);
    console.error(e);
    process.exit(1);
  }
}

async function downloadIso() {
  await downloadIsoFile("list-one.xml", "iso-4217-list-one.xml");
  await downloadIsoFile("list-three.xml", "iso-4217-list-three.xml");
}

downloadIso();
