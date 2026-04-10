/**
 * Blog Repository
 * Handles all database operations for blogs
 */

import { pool } from "../db/dbConnection.js";

export class BlogRepository {
  /**
   * Find all blogs
   */
  async findAll(filters?: { published?: boolean; category?: string }) {
    let query = `
      SELECT id, title, slug, excerpt, content, image_url, category, tags,
             published, created_at, updated_at
      FROM blogs
      WHERE is_deleted = false
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.published !== undefined) {
      query += ` AND published = $${paramIndex}`;
      params.push(filters.published);
      paramIndex++;
    }

    if (filters?.category) {
      query += ` AND category ILIKE $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find blog by ID
   */
  async findById(id: number) {
    const result = await pool.query(
      `SELECT id, title, slug, excerpt, content, image_url, category, tags,
              published, created_at, updated_at
       FROM blogs
       WHERE id = $1 AND is_deleted = false`,
      [id],
    );

    return result.rows[0] || null;
  }

  /**
   * Find blog by slug
   */
  async findBySlug(slug: string) {
    const result = await pool.query(
      `SELECT id, title, slug, excerpt, content, image_url, category, tags,
              published, created_at, updated_at
       FROM blogs
       WHERE slug = $1 AND is_deleted = false`,
      [slug],
    );

    return result.rows[0] || null;
  }

  /**
   * Create new blog
   */
  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    imageUrl?: string;
    category?: string;
    tags?: string;
    published: boolean;
  }) {
    const result = await pool.query(
      `INSERT INTO blogs (
         title, slug, excerpt, content, image_url, category, tags, published
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, slug, excerpt, content, image_url, category, tags,
                 published, created_at, updated_at`,
      [
        data.title,
        data.slug,
        data.excerpt || null,
        data.content,
        data.imageUrl || null,
        data.category || null,
        data.tags || null,
        data.published,
      ],
    );

    return result.rows[0];
  }

  /**
   * Update blog
   */
  async update(
    id: number,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      imageUrl?: string;
      category?: string;
      tags?: string;
      published?: boolean;
    },
  ) {
    const result = await pool.query(
      `UPDATE blogs
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           excerpt = COALESCE($3, excerpt),
           content = COALESCE($4, content),
           image_url = COALESCE($5, image_url),
           category = COALESCE($6, category),
           tags = COALESCE($7, tags),
           published = COALESCE($8, published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND is_deleted = false
       RETURNING id, title, slug, excerpt, content, image_url, category, tags,
                 published, created_at, updated_at`,
      [
        data.title,
        data.slug,
        data.excerpt,
        data.content,
        data.imageUrl,
        data.category,
        data.tags,
        data.published,
        id,
      ],
    );

    return result.rows[0] || null;
  }

  /**
   * Soft delete blog
   */
  async delete(id: number) {
    const result = await pool.query(
      `UPDATE blogs
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_deleted = false
       RETURNING id`,
      [id],
    );

    return result.rows[0] || null;
  }
}

export const blogRepository = new BlogRepository();
