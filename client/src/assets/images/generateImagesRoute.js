// generateResImages.js
const fs = require("fs");
const path = require("path");

const rootDir = "./photos"; // ルートディレクトリ
const output = ["const ResImagesRoute = {"];

const sanitizeKey = (filename) =>
  filename.replace(path.extname(filename), "").replace(/[^a-zA-Z0-9_]/g, "_");

const walkDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath); // 再帰
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
        const key = sanitizeKey(entry.name);
        const relativePath = `.${path.sep}${path
          .relative(__dirname, fullPath)
          .replace(/\\/g, "/")}`;
        output.push(`  ${key}: require("${relativePath}"),`);
      }
    }
  });
};

walkDir(rootDir);

output.push("};");
output.push("");
output.push("export default ResImagesRoute;");

fs.writeFileSync("ImagesRoute.tsx", output.join("\n"), "utf8");
console.log("✅ ResImagesRoute.js を生成しました！");
