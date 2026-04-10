/**
 * Holiday Controller
 * Handles HTTP requests and responses for holiday operations
 */

import { Request, Response } from "express";
import { holidayService } from "../services/holiday.service.js";

export class HolidayController {
  async getAllHolidays(req: Request, res: Response) {
    try {
      const filters: { type?: string } = {};

      if (req.query.type) {
        filters.type = String(req.query.type);
      }

      const holidays = await holidayService.getAllHolidays(filters);

      res.json({
        success: true,
        data: holidays,
      });
    } catch (error) {
      console.error("Get holidays error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch holidays",
      });
    }
  }

  async getHolidayById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }

      const holiday = await holidayService.getHolidayById(id);

      res.json({
        success: true,
        data: holiday,
      });
    } catch (error: any) {
      console.error("Get holiday error:", error);

      if (error.message === "Holiday not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to fetch holiday",
      });
    }
  }

  async createHoliday(req: Request, res: Response) {
    try {
      const payload = {
        name: req.body.name,
        type: req.body.type,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };

      const holiday = await holidayService.createHoliday(payload as any);

      res.status(201).json({
        success: true,
        message: "Holiday created successfully",
        data: holiday,
      });
    } catch (error: any) {
      console.error("Create holiday error:", error);

      if (error.message.includes("required")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create holiday",
      });
    }
  }

  async updateHoliday(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }

      const payload = {
        name: req.body.name,
        type: req.body.type,
        date: req.body.date ? new Date(req.body.date) : undefined,
      };

      const holiday = await holidayService.updateHoliday(id, payload);

      res.json({
        success: true,
        message: "Holiday updated successfully",
        data: holiday,
      });
    } catch (error: any) {
      console.error("Update holiday error:", error);

      if (error.message === "Holiday not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update holiday",
      });
    }
  }

  async deleteHoliday(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid holiday ID",
        });
      }

      const result = await holidayService.deleteHoliday(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Delete holiday error:", error);

      if (error.message === "Holiday not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete holiday",
      });
    }
  }
}

export const holidayController = new HolidayController();
