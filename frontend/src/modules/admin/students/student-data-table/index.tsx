import { Card } from '@/components/ui/card';
import { fetchStudents } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import { CustomDataTable } from '@/modules/common/custom-data-table';
import { studentColumns } from '../student-data-columns';

const StudentDataTable = async () => {
  try {
    const response = await fetchStudents();

    if (response.success) {
      return (
        <div className='flex flex-col w-full'>
          <AddNewHeader
            name='Student List'
            buttonName='New Student'
          />
          <Card className='w-full h-full shadow-none p-8'>
            <CustomDataTable
              data={response.data}
              columns={studentColumns}
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
            name='Student List'
            buttonName='New Student'
          />
          <div className='text-red-500'>
            {response.message ||
              'Failed to fetch student data.'}
          </div>
        </div>
      );
    }
  } catch (error) {
    console.error(
      'Error fetching student:',
      error
    );
    return (
      <div className='flex flex-col w-full'>
        <AddNewHeader
          name='Student List'
          buttonName='New Student'
        />
        <div className='text-red-500'>
          An unexpected error occurred while
          fetching student data. Please try again
          later.
        </div>
      </div>
    );
  }
};

export default StudentDataTable;
