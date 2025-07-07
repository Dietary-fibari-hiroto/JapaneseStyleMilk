import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/images"));
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname); // ← 元のファイル名そのまま使う！
  },
});

const upload = multer({ storage });

export default upload;
