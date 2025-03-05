import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  deleteUser,
  getAllUsers,
  getStudentById,
  getStudents,
  getUserByEmail,
  getUserById,
  sendContactMessage,
  updateStudent,
  updateUser,
} from '../../controllers/user';
import {
  verifyAdmin,
  verifyToken,
} from '../../middlewares/verify-token';

const router = Router();

router.get('/', getAllUsers);
router.post('/contact-email', sendContactMessage);

router.get('/students', getStudents);
router.post(
  '/students',
  verifyAdmin,
  createStudent
);
router.get(
  '/students/:id',
  verifyToken,
  getStudentById
);

router.get('/email/:email', getUserByEmail);
router.get('/:id', verifyToken, getUserById);

router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyAdmin, deleteUser);

// router.get(
//   '/students/:id',
//   verifyToken,
//   getUserById
// );
router.patch(
  '/students/:id',
  verifyToken,
  updateStudent
);
router.delete(
  '/students/:id',
  verifyToken,
  deleteStudent
);

export default router;
