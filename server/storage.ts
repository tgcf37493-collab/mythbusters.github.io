import { type BlogPost, type BlogCategory } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface IStorage {
  // Posts
  getAllPosts(): Promise<BlogPost[]>;
  getPublishedPosts(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPostsByCategory(category: string): Promise<BlogPost[]>;
  createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deletePost(id: string): Promise<boolean>;
  
  // Categories
  getAllCategories(): Promise<BlogCategory[]>;
  getCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  createCategory(category: Omit<BlogCategory, 'id' | 'postCount'>): Promise<BlogCategory>;
  updateCategory(id: string, category: Partial<BlogCategory>): Promise<BlogCategory | undefined>;
  deleteCategory(id: string): Promise<boolean>;
}

export class FileStorage implements IStorage {
  private contentDir = path.join(process.cwd(), 'content');
  private postsDir = path.join(this.contentDir, 'posts');
  private categoriesFile = path.join(this.contentDir, 'categories.json');

  constructor() {
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.contentDir, { recursive: true });
      await fs.mkdir(this.postsDir, { recursive: true });
      
      // Create default categories if they don't exist
      try {
        await fs.access(this.categoriesFile);
      } catch {
        const defaultCategories: BlogCategory[] = [
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
      console.error('Error ensuring directories:', error);
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async parseMarkdownFile(filePath: string): Promise<BlogPost | null> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const fileName = path.basename(filePath, '.md');
      
      return {
        id: data.id || randomUUID(),
        title: data.title || '',
        slug: data.slug || fileName,
        content,
        excerpt: data.excerpt || content.substring(0, 200) + '...',
        category: data.category || 'uncategorized',
        tags: data.tags || [],
        featuredImage: data.featuredImage,
        published: data.published !== false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error parsing markdown file:', error);
      return null;
    }
  }

  private async savePostToFile(post: BlogPost): Promise<void> {
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
      updatedAt: post.updatedAt,
    };

    const fileContent = matter.stringify(post.content, frontMatter);
    const filePath = path.join(this.postsDir, `${post.slug}.md`);
    await fs.writeFile(filePath, fileContent);
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const files = await fs.readdir(this.postsDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      const posts: BlogPost[] = [];
      for (const file of markdownFiles) {
        const filePath = path.join(this.postsDir, file);
        const post = await this.parseMarkdownFile(filePath);
        if (post) {
          posts.push(post);
        }
      }
      
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting all posts:', error);
      return [];
    }
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(post => post.published);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const filePath = path.join(this.postsDir, `${slug}.md`);
    try {
      const post = await this.parseMarkdownFile(filePath);
      return post || undefined;
    } catch (error) {
      return undefined;
    }
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const allPosts = await this.getPublishedPosts();
    return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const post: BlogPost = {
      ...postData,
      id: randomUUID(),
      slug: postData.slug || this.slugify(postData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.savePostToFile(post);
    return post;
  }

  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const allPosts = await this.getAllPosts();
    const existingPost = allPosts.find(p => p.id === id);
    
    if (!existingPost) {
      return undefined;
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...postData,
      id: existingPost.id,
      updatedAt: new Date().toISOString(),
    };

    // If slug changed, delete old file
    if (postData.slug && postData.slug !== existingPost.slug) {
      try {
        await fs.unlink(path.join(this.postsDir, `${existingPost.slug}.md`));
      } catch (error) {
        console.error('Error deleting old post file:', error);
      }
    }

    await this.savePostToFile(updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    const allPosts = await this.getAllPosts();
    const post = allPosts.find(p => p.id === id);
    
    if (!post) {
      return false;
    }

    try {
      await fs.unlink(path.join(this.postsDir, `${post.slug}.md`));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  async getAllCategories(): Promise<BlogCategory[]> {
    try {
      const categoriesData = await fs.readFile(this.categoriesFile, 'utf-8');
      const categories: BlogCategory[] = JSON.parse(categoriesData);
      
      // Update post counts
      const posts = await this.getPublishedPosts();
      return categories.map(category => ({
        ...category,
        postCount: posts.filter(post => post.category.toLowerCase() === category.name.toLowerCase()).length
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    const categories = await this.getAllCategories();
    return categories.find(cat => cat.slug === slug);
  }

  async createCategory(categoryData: Omit<BlogCategory, 'id' | 'postCount'>): Promise<BlogCategory> {
    const categories = await this.getAllCategories();
    const newCategory: BlogCategory = {
      ...categoryData,
      id: randomUUID(),
      slug: categoryData.slug || this.slugify(categoryData.name),
      postCount: 0,
    };

    categories.push(newCategory);
    await fs.writeFile(this.categoriesFile, JSON.stringify(categories, null, 2));
    return newCategory;
  }

  async updateCategory(id: string, categoryData: Partial<BlogCategory>): Promise<BlogCategory | undefined> {
    const categories = await this.getAllCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      return undefined;
    }

    const updatedCategory = { ...categories[index], ...categoryData };
    categories[index] = updatedCategory;
    
    await fs.writeFile(this.categoriesFile, JSON.stringify(categories, null, 2));
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const categories = await this.getAllCategories();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return false;
    }

    await fs.writeFile(this.categoriesFile, JSON.stringify(filteredCategories, null, 2));
    return true;
  }
}

export const storage = new FileStorage();
