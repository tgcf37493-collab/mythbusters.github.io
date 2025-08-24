import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Public routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
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

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug/posts", async (req, res) => {
    try {
      const posts = await storage.getPostsByCategory(req.params.slug);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category posts" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ token: ADMIN_PASSWORD, success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/admin/posts", requireAuth, async (req, res) => {
    try {
      const postData = {
        ...req.body,
        published: req.body.published ?? false,
        featuredImage: req.body.featuredImage || undefined,
        tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? [req.body.tags] : [])
      };
      // Ensure tags is always an array
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

  app.put("/api/admin/posts/:id", requireAuth, async (req, res) => {
    try {
      const cleanedData = { ...req.body };
      if (cleanedData.featuredImage === null) {
        cleanedData.featuredImage = undefined;
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

  app.delete("/api/admin/posts/:id", requireAuth, async (req, res) => {
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

  // SEO routes
  app.get("/sitemap.xml", (req, res) => {
    res.sendFile("sitemap.xml", { root: "public" });
  });

  app.get("/robots.txt", (req, res) => {
    res.sendFile("robots.txt", { root: "public" });
  });

  app.get("/ads.txt", (req, res) => {
    res.sendFile("ads.txt", { root: "public" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
