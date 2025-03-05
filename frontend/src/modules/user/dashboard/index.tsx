import {
  CheckCircle,
  Clock,
  InfoIcon,
} from 'lucide-react';
import { BannerCard } from '../banner-card';
import { CoursesList } from '../courses/course-list';
import { InfoCard } from '../info-card';

interface Props {
  userCourseProgress: UserCourseProgress;
}
const UserDashboard = ({
  userCourseProgress,
}: Props) => {
  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 gap-4'>
        <BannerCard
          icon={InfoIcon}
          label='Welcome to the dashboard'
          description={`This is where you can see your progress 
              and continue your courses. `}
        />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          icon={Clock}
          label='In Progress'
          numberOfItems={
            userCourseProgress.coursesInProgress
              .length
          }
        />
        <InfoCard
          icon={CheckCircle}
          label='Completed'
          numberOfItems={
            userCourseProgress.completedCourses
              .length
          }
          variant='success'
        />
      </div>
      <CoursesList
        items={[
          ...userCourseProgress.coursesInProgress,
          ...userCourseProgress.completedCourses,
        ]}
      />
    </div>
  );
};

export default UserDashboard;
