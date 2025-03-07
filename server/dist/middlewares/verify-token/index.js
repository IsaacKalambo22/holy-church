"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminAndManager = exports.verifyManager = exports.verifyAdmin = exports.verifyToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to verify JWT and add user information to the request object
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'] ||
        req.headers['Authorization'] ||
        '';
    const authHeader = authorizationHeader.toString();
    if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Unauthorized: Invalid token format',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Forbidden: Invalid or expired token',
            });
        }
        const { id, email, role } = decoded;
        req.user = { id, email, role };
        next();
    });
};
exports.verifyToken = verifyToken;
const verifyAdmin = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.ADMIN) {
            return next();
        }
        else {
            return res.status(403).json({
                message: 'Forbidden: Admin access required',
            });
        }
    });
};
exports.verifyAdmin = verifyAdmin;
const verifyManager = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.MANAGER) {
            return next();
        }
        else {
            return res.status(403).json({
                message: 'Forbidden: Managers access required',
            });
        }
    });
};
exports.verifyManager = verifyManager;
const verifyAdminAndManager = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        var _a, _b;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.MANAGER ||
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === client_1.Role.ADMIN) {
            return next();
        }
        else {
            return res.status(403).json({
                message: 'Forbidden: Admin or Manager access required',
            });
        }
    });
};
exports.verifyAdminAndManager = verifyAdminAndManager;
