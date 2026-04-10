/**
 * Holiday Routes
 */

import { Router } from "express";
import { holidayController } from "../controllers/holiday.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, (req, res) =>
  holidayController.getAllHolidays(req, res),
);

router.get("/:id", authenticate, (req, res) =>
  holidayController.getHolidayById(req, res),
);

router.post("/", authenticate, requireAdmin, (req, res) =>
  holidayController.createHoliday(req, res),
);

router.put("/:id", authenticate, requireAdmin, (req, res) =>
  holidayController.updateHoliday(req, res),
);

router.delete("/:id", authenticate, requireAdmin, (req, res) =>
  holidayController.deleteHoliday(req, res),
);

export default router;
