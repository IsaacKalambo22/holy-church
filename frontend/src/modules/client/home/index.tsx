import HomeGallery from './home-gallery';
import { MainCarousel } from './main-carousel';
import MotionImageText from './motion-image-text';
import HomeServices from './services';
import Testimonial from './testimonial';

export const homeData = [
  {
    imagePath: '/assets/images/carousel/4.jpg',
    title: 'Who we are',
    description:
      'We are a body known as Holy Church Assembly, A gathering of believers, fellowshipping together, located in Mthatha, Eastern Cape.',
  },
  {
    imagePath: '/assets/images/carousel/5.jpg',
    title: 'Our Vision',
    description: `Our vision is to raise a generation that will be baptized in the Holy Spirit, Purified with the flames of fire and represent Jesus Christ with no fear until His Glory appears. (1 Corinthians 9:19-23) and teach this generation how to flow in the Anointing of Jesus Christ and in His power.`,
  },
  {
    imagePath: '/assets/images/carousel/6.jpg',
    title: 'Our Mission',
    description: `Our mission is to make passionately devoted followers of Jesus Christ in Grace and Power. (Matthew 28:19-20)`,
  },
  {
    imagePath: '/assets/images/carousel/8.jpg',
    title: 'Values',
    description: `A PASSION FOR JESUS CHRIST Foremost in the life of our church is a passion for Jesus Christ manifested by an adherence to God’s Word and a dependence on the Holy Spirit’s empowering presence. (John 14:23-26)`,
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
      {/* <OurTeam /> */}
    </div>
  );
};

export default Home;
