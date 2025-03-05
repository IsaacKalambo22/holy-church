import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import {
  Facebook,
  Mail,
  Phone,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <Card className='z-30 w-full min-w-full bg-[#FFFFFF66] max-w-screen-2xl p-8 sm:px-20 py-12 shadow-none'>
      <div className='max-w-7xl mx-auto px-6 sm:px-2 flex gap-10 flex-col md:flex-row justify-between  h-full'>
        {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-8'> */}
        {/* Column 1 - Logo and Text */}
        <div>
          <Link href='/'>
            <div className='w-full'>
              <Image
                src='/assets/images/logo.png'
                width={60}
                height={60}
                alt='logo'
                className='object-contain'
              />
            </div>
          </Link>
          <p className='my-4 text-gray-600 text-[.9rem] font-sans font-normal'>
            Revealing the hidden potential
          </p>
          <p className='mb-4 text-gray-600 text-[.9rem] font-sans font-normal'>
            © 2025 Identity Impact Hub
          </p>
          <div className='flex space-x-4'>
            <Link
              href='https://youtube.com/@identityimpacthubltd?si=SSj6vr-LMeVUzAU2'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <Youtube />
              </Button>
            </Link>
            <Link
              href='https://www.linkedin.com/company/identity-impact-hub-ltd/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <LinkedInLogoIcon />
              </Button>
            </Link>

            <Link
              href='https://www.facebook.com/share/1DsHpqomw1/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                className='rounded-full'
                variant='outline'
                size='icon'
              >
                <Facebook />
              </Button>
            </Link>
          </div>
        </div>
        {/* Column 2 - Quick Links */}
        <div>
          <h3 className='font-semibold mb-4 text-gray-900'>
            Quick Links
          </h3>
          <ul className='flex flex-col gap-3'>
            <li>
              <Link
                href={'/'}
                className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={'/courses'}
                className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                href={'/services'}
                className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href={'/gallery'}
                className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
              >
                Gallery
              </Link>
            </li>

            <li>
              <Link
                href={'/contact'}
                className='text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900'
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* Column 4 - Contact Us */}
        {/* Column 4 - Contact Us */}
        <div>
          <h3 className='font-semibold mb-4 text-gray-900'>
            Contact Us
          </h3>
          <div className='flex flex-col gap-3'>
            {/* <address className='text-gray-600'>
                TAMA HOUSE, Independence Avenue,
                <br />
                P.O. Box 31360, Capital City,
                <br />
                Lilongwe 3, Malawi
              </address> */}

            <p className='flex gap-2 items-center'>
              <Mail
                size={16}
                className='text-gray-500'
              />
              <a
                href='mailto:info@identityimpacthub.com'
                className='font-medium text-muted-foreground hover:text-primary transition'
              >
                info@identityimpacthub.com
              </a>
            </p>
            <p className='flex gap-2 items-center'>
              <Phone
                size={16}
                className='text-gray-500'
              />
              <a
                href={`tel:+265998275848`}
                className='font-medium text-muted-foreground hover:text-primary transition'
              >
                +265 998 275 848
              </a>
            </p>

            <p className='flex gap-2 items-center'>
              <Phone
                size={16}
                className='text-gray-500'
              />
              <a
                href={`tel:+265884201503`}
                className='font-medium text-muted-foreground hover:text-primary transition'
              >
                +265 884 201 503
              </a>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Footer;
