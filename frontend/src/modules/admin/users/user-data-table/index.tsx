import { Card } from '@/components/ui/card';
import { fetchUsers } from '@/lib/api';
import { CustomDataTable } from '@/modules/common/custom-data-table';
import AddNewHeader from '../../add-new-header';
import { userColumns } from '../user-data-columns';

const UserDataTable = async () => {
  try {
    const response = await fetchUsers();

    if (response.success) {
      return (
        <div className='flex flex-col w-full'>
          <AddNewHeader
            name='User List'
            buttonName='New User'
          />
          <Card className='w-full h-full shadow-none p-8'>
            <CustomDataTable
              data={response.data}
              columns={userColumns}
              filterPlaceholder='Filter name...'
              filterColumn='name'
            />
          </Card>
        </div>
      );
    } else {
      return (
        <div className='flex flex-col w-full'>
          <AddNewHeader
            name='User List'
            buttonName='New User'
          />
          <div className='text-red-500'>
            {response.message ||
              'Failed to fetch user data.'}
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return (
      <div className='flex flex-col w-full'>
        <AddNewHeader
          name='User List'
          buttonName='New User'
        />
        <div className='text-red-500'>
          An unexpected error occurred while
          fetching user data. Please try again
          later.
        </div>
      </div>
    );
  }
};

export default UserDataTable;
