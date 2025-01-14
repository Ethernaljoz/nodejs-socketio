"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const env_1 = require("./constants/env");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const db_1 = __importDefault(require("./utils/db"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const authenticate_1 = __importDefault(require("./middlewares/authenticate"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const socket_1 = require("./utils/socket");
const port = env_1.PORT;
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: true }));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.get("/", (req, res) => {
    res.send('<h1>Welcome to Socketio ts</h1>');
});
socket_1.app.use("/api/auth", auth_routes_1.default);
socket_1.app.use("/api/user", authenticate_1.default, user_routes_1.default);
socket_1.app.use("/api/session", authenticate_1.default, session_routes_1.default);
socket_1.app.use("/api/message", authenticate_1.default, message_routes_1.default);
socket_1.app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
socket_1.app.use(errorHandler_1.default);
socket_1.server.listen(port, () => {
    (0, db_1.default)();
    console.log(`server running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map