/**
 * Blog Service
 * Contains business logic for blog operations
 */

import { blogRepository } from "../repositories/blog.repository.js";

export class BlogService {
  /**
   * Get all blogs
   */
  async getAllBlogs(filters?: { published?: boolean; category?: string }) {
    const blogs = await blogRepository.findAll(filters);
    return blogs.map((blog) => this.formatBlogResponse(blog));
  }

  /**
   * Get blog by ID
   */
  async getBlogById(id: number) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    return this.formatBlogResponse(blog);
  }

  /**
   * Create blog
   */
  async createBlog(data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    imageUrl?: string;
    category?: string;
    tags?: string | string[];
    published?: boolean;
  }) {
    if (!data.title || !data.content) {
      throw new Error("Title and content are required");
    }

    const slug = this.createSlug(data.slug || data.title);

    const existing = await blogRepository.findBySlug(slug);
    if (existing) {
      throw new Error("Slug already exists");
    }

    const blog = await blogRepository.create({
      title: data.title.trim(),
      slug,
      excerpt: data.excerpt?.trim(),
      content: data.content.trim(),
      imageUrl: data.imageUrl?.trim(),
      category: data.category?.trim(),
      tags: this.normalizeTags(data.tags),
      published: data.published ?? false,
    });

    return this.formatBlogResponse(blog);
  }

  /**
   * Update blog
   */
  async updateBlog(
    id: number,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      imageUrl?: string;
      category?: string;
      tags?: string | string[];
      published?: boolean;
    },
  ) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    const requestedSlug = data.slug || data.title;
    let updatedSlug: string | undefined;

    if (requestedSlug) {
      updatedSlug = this.createSlug(requestedSlug);
      const slugMatch = await blogRepository.findBySlug(updatedSlug);
      if (slugMatch && slugMatch.id !== id) {
        throw new Error("Slug already exists");
      }
    }

    const updated = await blogRepository.update(id, {
      title: data.title?.trim(),
      slug: updatedSlug,
      excerpt: data.excerpt?.trim(),
      content: data.content?.trim(),
      imageUrl: data.imageUrl?.trim(),
      category: data.category?.trim(),
      tags: data.tags !== undefined ? this.normalizeTags(data.tags) : undefined,
      published: data.published,
    });

    if (!updated) {
      throw new Error("Failed to update blog");
    }

    return this.formatBlogResponse(updated);
  }

  /**
   * Delete blog
   */
  async deleteBlog(id: number) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error("Blog not found");
    }

    const deleted = await blogRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete blog");
    }

    return { message: "Blog deleted successfully" };
  }

  private createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  private normalizeTags(value?: string | string[]) {
    if (!value) return undefined;

    const tags = Array.isArray(value)
      ? value
      : value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

    return tags.join(",");
  }

  /**
   * Format blog response
   */
  private formatBlogResponse(blog: any) {
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      imageUrl: blog.image_url,
      category: blog.category,
      tags: blog.tags,
      published: blog.published,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    };
  }
}

export const blogService = new BlogService();
