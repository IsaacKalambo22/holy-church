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
const course_1 = __importDefault(require("./routes/course"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const user_1 = __importDefault(require("./routes/user"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: 'cross-origin',
}));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
app.get('/', (req, res) => {
    res.send('<html><body><h1>Welcome to the Home Route</h1></body></html>');
});
app.use('/identity-impact-hub/auth', auth_1.default);
app.use('/identity-impact-hub/users', user_1.default);
app.use('/identity-impact-hub/courses', course_1.default);
app.use('/identity-impact-hub/gallery', gallery_1.default);
app.use('/identity-impact-hub/transactions', transaction_1.default);
/* SERVER */
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
});
