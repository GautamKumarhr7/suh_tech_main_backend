/**
 * System Preferences Controller
 */

import { Request, Response } from "express";
import { systemPreferencesService } from "../services/system-preferences.service.js";

export class SystemPreferencesController {
  async getPreferences(req: Request, res: Response) {
    try {
      const preferences = await systemPreferencesService.getPreferences();

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      console.error("Get system preferences error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch system preferences",
      });
    }
  }

  async savePreferences(req: Request, res: Response) {
    try {
      const payload = {
        timezone: req.body.timezone,
        dateFormat: req.body.dateFormat,
        timeFormat: req.body.timeFormat,
      };

      const preferences =
        await systemPreferencesService.savePreferences(payload);

      res.json({
        success: true,
        message: "System preferences saved successfully",
        data: preferences,
      });
    } catch (error: any) {
      console.error("Save system preferences error:", error);

      if (error.message.includes("required")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to save system preferences",
      });
    }
  }
}

export const systemPreferencesController = new SystemPreferencesController();
