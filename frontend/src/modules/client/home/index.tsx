import FrequentlyAskedQuestions from './frequently-asked-questions';
import HomeGallery from './home-gallery';
import { MainCarousel } from './main-carousel';
import MotionImageText from './motion-image-text';
import OurTeam from './our-team';
import HomeServices from './services';
import Testimonial from './testimonial';

export const homeData = [
  {
    imagePath: '/assets/images/carousel/4.jpg',
    title: 'Who we are',
    description:
      'We are a transformative training institution focused on equipping individuals with self-manifestation principles to overcome identity confusion—a major contributor to unemployment.',
  },
  {
    imagePath: '/assets/images/carousel/5.jpg',
    title: 'Our Vision',
    description: `To develop individuals' aptitudes with sound mindsets and empowering health messages, enabling them to become agents of effective influence globally`,
  },
  {
    imagePath: '/assets/images/carousel/6.jpg',
    title: 'Our Mission',
    description: `To create strategic platforms and foster meaningful connections that empower individual's  unique aptitudes to navigate the world with purpose and influence.`,
  },
  {
    imagePath: '/assets/images/carousel/8.jpg',
    title: 'Our Goal',
    description: `Identifying and developing individual's exceptional talents, equipping them with the resources and support needed by ensuring that they are strategically prepared for maximum impact before being introduced to the market`,
  },
  
];

const Home = () => {
  return (
    <div className='flex flex-col items-center gap-8 mb-16'>
      <MainCarousel />
      <h2 className='text-4xl font-bold blue_gradient text-center'>
        Discover More About Us
      </h2>
      {/* HomeData Section */}
      <div className='w-full flex flex-col items-center gap-12'>
        <MotionImageText />
      </div>
      <HomeServices />
      <HomeGallery />

      <Testimonial />
      {/* <InfiniteMovingCards
        items={testimonials}
        direction='left'
        speed='slow'
      /> */}

      <OurTeam />

      <FrequentlyAskedQuestions />
    </div>
  );
};

export default Home;
