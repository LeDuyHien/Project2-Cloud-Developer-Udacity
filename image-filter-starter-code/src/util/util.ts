import fs from "fs";
import Jimp = require("jimp");
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photoBuffer = await axios.get(inputURL, {
        responseType: "arraybuffer"
      })
      const photo = await Jimp.read(Buffer.from(photoBuffer.data));
      const outPath =
          "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
          .resize(1920, 1080) // resize
          .quality(100) // set JPEG quality
          .greyscale() // set greyscale
          .write(__dirname + outPath, (img) => {
            if (img != null) {
              console.error(img.message)
            }
            resolve(__dirname + outPath);
          });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
