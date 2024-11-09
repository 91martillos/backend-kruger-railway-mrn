//vamos a crear uns servicio para traer todos los logs

import express from "express";
import { testLogs } from "../controllers/logs.controller.js";

const router = express.Router();

router.get("/", testLogs);

export default router;
