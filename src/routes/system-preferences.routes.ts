/**
 * System Preferences Routes
 */

import { Router } from "express";
import { systemPreferencesController } from "../controllers/system-preferences.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, (req, res) =>
  systemPreferencesController.getPreferences(req, res),
);

router.post("/", authenticate, requireAdmin, (req, res) =>
  systemPreferencesController.savePreferences(req, res),
);

router.put("/", authenticate, requireAdmin, (req, res) =>
  systemPreferencesController.savePreferences(req, res),
);

export default router;
