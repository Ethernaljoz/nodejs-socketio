"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const sessionRoutes = (0, express_1.Router)();
// prefix /session
sessionRoutes.get("/", session_controller_1.getSessionHandler);
sessionRoutes.delete("/:id", session_controller_1.deleteSessionHandler);
exports.default = sessionRoutes;
//# sourceMappingURL=session.routes.js.map