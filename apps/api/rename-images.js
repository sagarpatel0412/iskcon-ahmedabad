const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "uploads/krishna-images/"); 
const prefix = "krishna";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

const files = fs
  .readdirSync(folderPath)
  .filter((file) =>
    imageExtensions.includes(path.extname(file).toLowerCase())
  )
  .sort();

files.forEach((file, index) => {
  const ext = path.extname(file).toLowerCase();
  const oldPath = path.join(folderPath, file);
  const newName = `${prefix}_${index + 1}${ext}`;
  const newPath = path.join(folderPath, newName);

  fs.renameSync(oldPath, newPath);

  console.log(`${file} -> ${newName}`);
});

console.log("All images renamed successfully.");