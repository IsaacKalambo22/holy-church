import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FileText } from 'lucide-react';

const AccordionSections = ({
  sections,
}: AccordionSectionsProps) => {
  console.log({ sections });
  return (
    <Accordion type='multiple' className='w-full'>
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.title}
          className='border-x border-b border-gray-600 overflow-hidden first:border-t first:rounded-t-lg last:rounded-b-lg'
        >
          <AccordionTrigger className='accordion-section__trigger'>
            <h5 className='text-gray-700 font-medium'>
              {section.title}
            </h5>
          </AccordionTrigger>
          <AccordionContent className=' px-4 pb-2'>
            <ul>
              {section.chapters.map((chapter) => (
                <li
                  key={chapter.id}
                  className='flex items-center text-gray-500 py-1'
                >
                  <FileText className='mr-2 w-4 h-4' />
                  <span className='text-sm'>
                    {chapter.title}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionSections;
