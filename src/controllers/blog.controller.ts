/**
 * Blog Controller
 * Handles HTTP requests and responses for blog operations
 */

import { Request, Response } from "express";
import { blogService } from "../services/blog.service.js";

export class BlogController {
  /**
   * GET /blogs
   */
  async getAllBlogs(req: Request, res: Response) {
    try {
      const filters: { published?: boolean; category?: string } = {};

      if (req.query.published !== undefined) {
        filters.published = String(req.query.published) === "true";
      }

      if (req.query.category) {
        filters.category = String(req.query.category);
      }

      const blogs = await blogService.getAllBlogs(filters);

      res.json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      console.error("Get blogs error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blogs",
      });
    }
  }

  /**
   * GET /blogs/:id
   */
  async getBlogById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const blog = await blogService.getBlogById(id);

      res.json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      console.error("Get blog error:", error);

      if (error.message === "Blog not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch blog",
      });
    }
  }

  /**
   * POST /blogs
   */
  async createBlog(req: Request, res: Response) {
    try {
      const payload = {
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        tags: req.body.tags,
        published: req.body.published,
      };

      const blog = await blogService.createBlog(payload);

      res.status(201).json({
        success: true,
        data: blog,
        message: "Blog created successfully",
      });
    } catch (error: any) {
      console.error("Create blog error:", error);

      if (
        error.message === "Title and content are required" ||
        error.message === "Slug already exists"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create blog",
      });
    }
  }

  /**
   * PUT /blogs/:id
   */
  async updateBlog(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const payload = {
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        tags: req.body.tags,
        published: req.body.published,
      };

      const blog = await blogService.updateBlog(id, payload);

      res.json({
        success: true,
        data: blog,
        message: "Blog updated successfully",
      });
    } catch (error: any) {
      console.error("Update blog error:", error);

      if (error.message === "Blog not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "Slug already exists") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update blog",
      });
    }
  }

  /**
   * DELETE /blogs/:id
   */
  async deleteBlog(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const result = await blogService.deleteBlog(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete blog error:", error);

      if (error.message === "Blog not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
      });
    }
  }
}

export const blogController = new BlogController();
