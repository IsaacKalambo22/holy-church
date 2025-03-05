'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'James Kapinga',
    role: 'Startup Founder',
    message: `At the outset , I struggled with a lack of self awareness and direction in life . Through ldentity Impact Hub 's ( formerly Generation With Impact ) unique approach to self discovery andmindset transformation , I gained a profound understanding of myself and my purpose . The team's guidance has been invaluable , leading to a significant shift in my mindset . I now feel
more empowered , confident and capable of navigating life's challenges . I highly recommend ldentity Impact Hub to anyone seeking a more authentic and fulfling life . Their transformative services have truly changed my life`,
    imageUrl: '/assets/images/testimonials/1.jpg',
  },
  {
    name: 'Bashir Abdullah',
    role: 'Community Leader',
    message: `At the inception of our collaboration, I was struggling to define my dream and how to turn it into reality. However, through ldentity Impact Hub's dedication and expertise, I have gained aclear
vision, discovered hidden potentials within myself, and feel fully empowered and directed in my journey. Today, I am delighted with the exceptional services provided, and I wholeheartedly
recommend ldentity Impact Hub to anyone seeking a similar transformation, especially those struggling with how to bring their dreams to life and overcome the fear of failure. Their
commitment to excellence and customer satisfaction is truly commendable.`,
    imageUrl: '/assets/images/testimonials/2.jpg',
  },
  {
    name: 'Patrick Chavundikira',
    role: 'Social Entrepreneur',
    message: `Before connecting with Sir Peace Alex Makaka , ldentity Impact Hub CEO, in 2022 , I strugled with a lack of purpose and felt lost . Through his content and conversations , I realized I was facing an 'ldentity Confusion Crisis . ' This led me to explore my divine purpose and join
discussions on understanding existence from the Creator 's perspective . l engaged in
mentorship programs at Generation With Impact ( now ldentity Impact Hub ) , which helped me clarify my identity , relationships , career , and overall life direction . The mentorship provided valuable tools for growth , boosting my confidence in pursuing purpose-driven success . I am deeply grateful for ldentity Impact Hub 's life changing impact and highly recommend their
services for anyone seeking to unlock their true potential`,
    imageUrl: '/assets/images/testimonials/3.jpg',
  },
  {
    name: 'Patience Mair',
    role: 'Purpose Discovery',
    message: `At a time when I struggled with self-doubt and lacked clarity in my identity, career, and purpose, Identity Impact Hub Limited—formerly known as Generation With Impact—provided the transformative mentorship I needed. Under the leadership of Mr. Peace Alex Makaka and through the dedicated efforts of his team, I was able to reframe my mindset, recognize my strengths, and align my values with my career goals. Their guidance helped me develop resilience, confidence, and a renewed sense of purpose, leading to both personal and professional growth. I am deeply grateful for their invaluable support, which has been a pivotal force in unlocking my potential, and I highly recommend Identity Impact Hub Limited to anyone seeking clarity, growth, and fulfillment."`,
    imageUrl: '/assets/images/testimonials/4.jpg',
  },
];

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center gap-8 w-full'>
      <h2 className='blue_gradient text-3xl font-bold'>
        Testimonials
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4'>
        {testimonials.map(
          (testimonial, index) => (
            <Card
              key={index}
              className='flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-amber-600'
            >
              <Avatar className='h-20 w-20 rounded-full'>
                {testimonial.imageUrl && (
                  <AvatarImage
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                  />
                )}
                <AvatarFallback className='rounded-full'>
                  {testimonial.name
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <h3 className='text-lg text-center sm:text-left font-semibold text-gray-800'>
                  {testimonial.name}
                </h3>
                <p className='text-sm text-gray-600 italic'>
                  &quot;{testimonial.message}
                  &quot;
                </p>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default Testimonial;
