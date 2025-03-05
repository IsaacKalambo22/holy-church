'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
}
const AdminBilling = ({
  transactions,
}: Props) => {
  const [paymentType, setPaymentType] =
    useState('all');

  const filteredData =
    transactions?.filter((transaction) => {
      const matchesTypes =
        paymentType === 'all' ||
        transaction.paymentProvider ===
          paymentType;
      return matchesTypes;
    }) || [];

  //   if (!isLoaded) return <Loading />;
  //   if (!user)
  //     return (
  //       <div>
  //         Please sign in to view your billing
  //         information.
  //       </div>
  //     );

  return (
    <Card className='space-y-8 shadow-none'>
      <div className='space-y-6 p-6 bg-customgreys-secondarybg'>
        <h2 className='text-xl font-semibold'>
          Payment History
        </h2>
        <div className='flex space-x-4'>
          <Select
            value={paymentType}
            onValueChange={setPaymentType}
          >
            <SelectTrigger className='w-[180px] bg-customgreys-primarybg'>
              <SelectValue placeholder='Payment Type' />
            </SelectTrigger>

            <SelectContent className='hover:!bg-white-50 hover:!text-customgreys-primarybg cursor-pointer'>
              <SelectItem
                className='billing__select-item'
                value='all'
              >
                All Types
              </SelectItem>
              <SelectItem
                className='billing__select-item'
                value='stripe'
              >
                Stripe
              </SelectItem>
              <SelectItem
                className='billing__select-item'
                value='paypal'
              >
                Paypal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='h-[400px] w-full'>
          <Table className='text-customgreys-dirtyGrey min-h-[200px]'>
            <TableHeader className='billing__table-header'>
              <TableRow className='billing__table-header-row'>
                <TableHead className='billing__table-cell'>
                  Date
                </TableHead>
                <TableHead className='billing__table-cell'>
                  Amount
                </TableHead>
                <TableHead className='billing__table-cell'>
                  Payment Method
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='billing__table-body'>
              {filteredData.length > 0 ? (
                filteredData.map(
                  (transaction) => (
                    <TableRow
                      className='billing__table-row'
                      key={
                        transaction.transactionId
                      }
                    >
                      <TableCell className='billing__table-cell'>
                        {new Date(
                          transaction.dateTime
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className='billing__table-cell billing__amount'>
                        {formatPrice(
                          transaction.amount
                        )}
                      </TableCell>
                      <TableCell className='billing__table-cell'>
                        {
                          transaction.paymentProvider
                        }
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow className='billing__table-row'>
                  <TableCell
                    className='billing__table-cell text-center'
                    colSpan={3}
                  >
                    No transactions to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default AdminBilling;
