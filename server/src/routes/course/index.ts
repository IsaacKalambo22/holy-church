import { Router } from 'express';
import {
  createCourse,
  createCourseAttachment,
  createCourseChapter,
  deleteCourse,
  deleteCourseAttachment,
  getCategories,
  getCourse,
  getCourseChapter,
  getCourses,
  getPublishedCourse,
  getPublishedCourses,
  getPublishedCoursesWithProgress,
  getPublishedOrFreeChapterWithProgress,
  getUserCourseProgress,
  getUserProgress,
  reorderCourseChapters,
  updateCourse,
  updateCourseChapter,
  updateUserCourseProgress,
} from '../../controllers/course';
import {
  getPublishedCourseProgress,
  getPurchasedCourse,
} from '../../controllers/course/index';
import {
  verifyAdmin,
  verifyToken,
} from '../../middlewares/verify-token';

const router = Router();

router.get('/', getCourses);
router.get('/categories', getCategories);
router.get(
  '/published-courses',
  getPublishedCourses
);
router.get(
  '/:id/published-course',
  getPublishedCourse
);
router.get(
  '/published-courses-with-progress',
  verifyToken,
  getPublishedCoursesWithProgress
);
router.get(
  '/:courseId/chapters/:chapterId',
  verifyToken,
  getPublishedOrFreeChapterWithProgress
);
router.get(
  '/:id/published-courses-progress',
  verifyToken,
  getPublishedCourseProgress
);
router.get(
  '/:id/purchased-course',
  verifyToken,
  getPurchasedCourse
);

router.get(
  '/:id/user-course-progress',
  verifyToken,
  getUserCourseProgress
);
router.get(
  '/user-progress',
  verifyToken,
  getUserProgress
);
router.post('/', verifyAdmin, createCourse);
router.get('/:id', getCourse);
router.patch('/:id', verifyAdmin, updateCourse);
router.patch(
  '/:id/chapters/reorder',
  verifyAdmin,
  reorderCourseChapters
);
router.post(
  '/:id/chapters',
  verifyAdmin,
  createCourseChapter
);
router.post(
  '/:id/attachments',
  verifyAdmin,
  createCourseAttachment
);
router.delete(
  '/attachments/:id',
  verifyAdmin,
  deleteCourseAttachment
);
router.patch(
  '/:id/chapters/:chapterId',
  verifyAdmin,
  updateCourseChapter
);
router.get(
  '/:id/course-chapters/:chapterId',
  verifyAdmin,
  getCourseChapter
);
router.patch(
  '/chapters/:chapterId/progress',
  verifyToken,
  updateUserCourseProgress
);

router.delete('/:id', verifyAdmin, deleteCourse);

export default router;
