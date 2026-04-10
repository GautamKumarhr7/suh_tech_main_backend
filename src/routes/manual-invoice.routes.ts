/**
 * Manual Invoice Routes
 */

import { Router } from "express";
import { manualInvoiceController } from "../controllers/manual-invoice.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All manual invoice routes require authentication
router.use(authenticate);

router.get("/", (req, res) =>
  manualInvoiceController.getAllManualInvoices(req, res),
);

router.get("/:id", (req, res) =>
  manualInvoiceController.getManualInvoiceById(req, res),
);

router.post("/", (req, res) =>
  manualInvoiceController.createManualInvoice(req, res),
);

router.put("/:id", (req, res) =>
  manualInvoiceController.updateManualInvoice(req, res),
);

router.delete("/:id", (req, res) =>
  manualInvoiceController.deleteManualInvoice(req, res),
);

export default router;
