export const dynamic = 'force-dynamic';

import { fetchUserProgress } from '@/lib/api';
import UserDashboard from '@/modules/user/dashboard';

const UserDashboardPage = async () => {
  let userCourseProgress: UserCourseProgress | null =
    null;
  try {
    const response = await fetchUserProgress();

    userCourseProgress = response.data || [];
  } catch (error) {
    console.log(
      'Failed to fetch chapter:',
      error
    );
    return (
      <div>
        {/* <HeaderText title='Chapter' /> */}
        <p className='text-red-500'>
          Failed to load chapter. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full mb-20 '>
      {/* <HeaderText title='Chapter' /> */}
      {userCourseProgress ? (
        <UserDashboard
          userCourseProgress={userCourseProgress}
        />
      ) : (
        <p className='text-gray-500 text-lg mt-5 text-center'>
          Chapter not found
        </p>
      )}
    </div>
  );
};

export default UserDashboardPage;
