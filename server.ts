import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  const DATA_DIR = path.join(process.cwd(), "data");
  const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
  const UPLOADS_DIR = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }

  if (!fs.existsSync(BLOGS_FILE)) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify([], null, 2));
  }

  // Configure Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  // Serve uploads folder statically
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API Routes
  app.post("/api/upload", upload.single("image"), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  app.get("/api/blogs", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
    res.json(blogs);
  });

  app.get("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
    const blog = blogs.find((b: any) => b.id === req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  });

  app.post("/api/blogs", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
    const newBlog = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    res.status(201).json(newBlog);
  });

  app.put("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
    const index = blogs.findIndex((b: any) => b.id === req.params.id);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...req.body, updatedAt: new Date().toISOString() };
      fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
      res.json(blogs[index]);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
    const filteredBlogs = blogs.filter((b: any) => b.id !== req.params.id);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filteredBlogs, null, 2));
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
