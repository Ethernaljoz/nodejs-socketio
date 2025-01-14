"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
// prefix /user
userRoutes.get("/", user_controller_1.getUserHandler);
userRoutes.get("/conversation", user_controller_1.getUsersForSidebar);
exports.default = userRoutes;
//# sourceMappingURL=user.routes.js.map