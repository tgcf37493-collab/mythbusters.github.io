// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
var FileStorage = class {
  contentDir = path.join(process.cwd(), "content");
  postsDir = path.join(this.contentDir, "posts");
  categoriesFile = path.join(this.contentDir, "categories.json");
  constructor() {
    this.ensureDirectories();
  }
  async ensureDirectories() {
    try {
      await fs.mkdir(this.contentDir, { recursive: true });
      await fs.mkdir(this.postsDir, { recursive: true });
      try {
        await fs.access(this.categoriesFile);
      } catch {
        const defaultCategories = [
          {
            id: randomUUID(),
            name: "Health Myths",
            slug: "health-myths",
            description: "Debunking common health and nutrition myths",
            color: "#3B82F6",
            postCount: 0
          },
          {
            id: randomUUID(),
            name: "Science Myths",
            slug: "science-myths",
            description: "Exploring scientific misconceptions",
            color: "#8B5CF6",
            postCount: 0
          },
          {
            id: randomUUID(),
            name: "History Myths",
            slug: "history-myths",
            description: "Fact-checking historical beliefs",
            color: "#F59E0B",
            postCount: 0
          }
        ];
        await fs.writeFile(this.categoriesFile, JSON.stringify(defaultCategories, null, 2));
      }
    } catch (error) {
      console.error("Error ensuring directories:", error);
    }
  }
  slugify(text2) {
    return text2.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  async parseMarkdownFile(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const fileName = path.basename(filePath, ".md");
      return {
        id: data.id || randomUUID(),
        title: data.title || "",
        slug: data.slug || fileName,
        content,
        excerpt: data.excerpt || content.substring(0, 200) + "...",
        category: data.category || "uncategorized",
        tags: data.tags || [],
        featuredImage: data.featuredImage,
        published: data.published !== false,
        createdAt: data.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: data.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      console.error("Error parsing markdown file:", error);
      return null;
    }
  }
  async savePostToFile(post) {
    const frontMatter = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      featuredImage: post.featuredImage,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
    const fileContent = matter.stringify(post.content, frontMatter);
    const filePath = path.join(this.postsDir, `${post.slug}.md`);
    await fs.writeFile(filePath, fileContent);
  }
  async getAllPosts() {
    try {
      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter((file) => file.endsWith(".md"));
      const posts2 = [];
      for (const file of markdownFiles) {
        const filePath = path.join(this.postsDir, file);
        const post = await this.parseMarkdownFile(filePath);
        if (post) {
          posts2.push(post);
        }
      }
      return posts2.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Error getting all posts:", error);
      return [];
    }
  }
  async getPublishedPosts() {
    const allPosts = await this.getAllPosts();
    return allPosts.filter((post) => post.published);
  }
  async getPostBySlug(slug) {
    const filePath = path.join(this.postsDir, `${slug}.md`);
    try {
      const post = await this.parseMarkdownFile(filePath);
      return post || void 0;
    } catch (error) {
      return void 0;
    }
  }
  async getPostsByCategory(category) {
    const allPosts = await this.getPublishedPosts();
    return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
  }
  async createPost(postData) {
    const post = {
      ...postData,
      id: randomUUID(),
      slug: postData.slug || this.slugify(postData.title),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.savePostToFile(post);
    return post;
  }
  async updatePost(id, postData) {
    const allPosts = await this.getAllPosts();
    const existingPost = allPosts.find((p) => p.id === id);
    if (!existingPost) {
      return void 0;
    }
    const updatedPost = {
      ...existingPost,
      ...postData,
      id: existingPost.id,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (postData.slug && postData.slug !== existingPost.slug) {
      try {
        await fs.unlink(path.join(this.postsDir, `${existingPost.slug}.md`));
      } catch (error) {
        console.error("Error deleting old post file:", error);
      }
    }
    await this.savePostToFile(updatedPost);
    return updatedPost;
  }
  async deletePost(id) {
    const allPosts = await this.getAllPosts();
    const post = allPosts.find((p) => p.id === id);
    if (!post) {
      return false;
    }
    try {
      await fs.unlink(path.join(this.postsDir, `${post.slug}.md`));
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }
  async getAllCategories() {
    try {
      const categoriesData = await fs.readFile(this.categoriesFile, "utf-8");
      const categories2 = JSON.parse(categoriesData);
      const posts2 = await this.getPublishedPosts();
      return categories2.map((category) => ({
        ...category,
        postCount: posts2.filter((post) => post.category.toLowerCase() === category.name.toLowerCase()).length
      }));
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  }
  async getCategoryBySlug(slug) {
    const categories2 = await this.getAllCategories();
    return categories2.find((cat) => cat.slug === slug);
  }
  async createCategory(categoryData) {
    const categories2 = await this.getAllCategories();
    const newCategory = {
      ...categoryData,
      id: randomUUID(),
      slug: categoryData.slug || this.slugify(categoryData.name),
      postCount: 0
    };
    categories2.push(newCategory);
    await fs.writeFile(this.categoriesFile, JSON.stringify(categories2, null, 2));
    return newCategory;
  }
  async updateCategory(id, categoryData) {
    const categories2 = await this.getAllCategories();
    const index = categories2.findIndex((cat) => cat.id === id);
    if (index === -1) {
      return void 0;
    }
    const updatedCategory = { ...categories2[index], ...categoryData };
    categories2[index] = updatedCategory;
    await fs.writeFile(this.categoriesFile, JSON.stringify(categories2, null, 2));
    return updatedCategory;
  }
  async deleteCategory(id) {
    const categories2 = await this.getAllCategories();
    const filteredCategories = categories2.filter((cat) => cat.id !== id);
    if (filteredCategories.length === categories2.length) {
      return false;
    }
    await fs.writeFile(this.categoriesFile, JSON.stringify(filteredCategories, null, 2));
    return true;
  }
};
var storage = new FileStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  featuredImage: text("featured_image"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").notNull().default("#3B82F6")
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  app2.get("/api/posts", async (req, res) => {
    try {
      const posts2 = await storage.getPublishedPosts();
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (!post.published) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getAllCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:slug/posts", async (req, res) => {
    try {
      const posts2 = await storage.getPostsByCategory(req.params.slug);
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category posts" });
    }
  });
  app2.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ token: ADMIN_PASSWORD, success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });
  app2.get("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      const posts2 = await storage.getAllPosts();
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.post("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      const postData = {
        ...req.body,
        published: req.body.published ?? false,
        featuredImage: req.body.featuredImage || void 0,
        tags: Array.isArray(req.body.tags) ? req.body.tags : req.body.tags ? [req.body.tags] : []
      };
      if (!postData.tags) postData.tags = [];
      const validatedData = insertPostSchema.parse(postData);
      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  app2.put("/api/admin/posts/:id", requireAuth, async (req, res) => {
    try {
      const cleanedData = { ...req.body };
      if (cleanedData.featuredImage === null) {
        cleanedData.featuredImage = void 0;
      }
      if (cleanedData.tags && !Array.isArray(cleanedData.tags)) {
        cleanedData.tags = cleanedData.tags ? [cleanedData.tags] : [];
      }
      const validatedData = insertPostSchema.partial().parse(cleanedData);
      const post = await storage.updatePost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update post" });
    }
  });
  app2.delete("/api/admin/posts/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  app2.get("/sitemap.xml", (req, res) => {
    res.sendFile("sitemap.xml", { root: "public" });
  });
  app2.get("/robots.txt", (req, res) => {
    res.sendFile("robots.txt", { root: "public" });
  });
  app2.get("/ads.txt", (req, res) => {
    res.sendFile("ads.txt", { root: "public" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    rollupOptions: {
      output: {
        manualChunks: void 0
      }
    },
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
