import { fetchTransactions } from '@/lib/api';
import AdminBilling from './billing-table';

const Billing = async () => {
  let transactions = [];
  try {
    const data = await fetchTransactions(); // Fetch the data directly
    transactions = data?.data;
  } catch (error) {
    console.error(
      'Failed to fetch transactions:',
      error
    );
    return (
      <div>
        {/* <AddNewHeader
          name='Transactions'
          buttonName='New Course'
        /> */}
        <p className='text-red-500'>
          Failed to load transactions.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* <AddNewHeader
        name='Transactions'
        buttonName='New Course'
      /> */}
      {transactions.length > 0 ? (
        <AdminBilling
          transactions={transactions}
        />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No transactions available. Create a new
          transactions to get started!
        </p>
      )}
    </div>
  );
};

export default Billing;
