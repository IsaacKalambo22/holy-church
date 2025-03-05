import { Card } from '@/components/ui/card';

const CustomModal = ({
  isOpen,
  onClose,
  children,
}: CustomFixedModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <Card
        className='fixed inset-0 bg-black bg-opacity-50 z-40'
        onClick={onClose}
      />
      <Card className='fixed inset-y-0 right-0 w-full max-w-md  shadow-lg z-50 overflow-y-auto'>
        <div className='p-6'>{children}</div>
      </Card>
    </>
  );
};

export default CustomModal;
