'use client';

import { useCheckoutNavigation } from '@/hooks/use-checkout-navigation';

import { Card } from '@/components/ui/card';
import Header from '@/modules/admin/header';
import Completion from './completion';
import Payment from './payment';
import WizardStepper from './wizard-stepper';

const Checkout = () => {
  const { checkoutStep } =
    useCheckoutNavigation();

  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <Payment />;
      case 2:
        return <Payment />;
      case 3:
        return <Completion />;
      default:
        return <Payment />;
    }
  };

  return (
    <div className='flex flex-col '>
      <Header title='Checkout' />
      <Card className='w-full shadow-none p-4 h-full flex flex-col items-center py-12'>
        <WizardStepper
          currentStep={checkoutStep}
        />
        <div className='w-full flex flex-col items-center mt-10'>
          {renderStep()}
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
