"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messsage_controller_1 = require("../controllers/messsage.controller");
const messageRoutes = (0, express_1.Router)();
// prefix /message
messageRoutes.post("/send/:id", messsage_controller_1.sendMessage);
messageRoutes.get("/:id", messsage_controller_1.getMessages);
exports.default = messageRoutes;
//# sourceMappingURL=message.routes.js.map