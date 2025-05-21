"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const auth_1 = __importDefault(require("./routes/auth"));
const sermon_1 = __importDefault(require("./routes/sermon"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const user_1 = __importDefault(require("./routes/user"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
// Basic middleware
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)('common'));
// Security middleware
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(helmet_1.default.noSniff());
app.use(helmet_1.default.xssFilter());
app.use(helmet_1.default.hidePoweredBy());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
/* ROUTES */
const API_PREFIX = '/api/v1';
// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Holy Church API',
        timestamp: new Date().toISOString()
    });
});
// API routes
app.use('/auth', auth_1.default);
app.use('/users', user_1.default);
app.use('/sermons', sermon_1.default);
app.use('/gallery', gallery_1.default);
app.use('/donations', transaction_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.url}`
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    // Gracefully shutdown
    server.close(() => {
        process.exit(1);
    });
});
