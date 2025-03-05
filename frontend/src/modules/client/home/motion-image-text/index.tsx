'use client';
import { motion } from 'framer-motion';
import { homeData } from '..';
import { ImageTextHome } from '../image-text-home';

const MotionImageText = () => {
  return (
    <>
      {homeData.map((service, index) => (
        <motion.div
          key={index}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.2,
          }}
          viewport={{ amount: 0.4 }}
        >
          <ImageTextHome
            key={index}
            imagePath={service.imagePath}
            heading={service.title}
            description={service.description}
            imagePosition={
              index % 2 === 0 ? 'left' : 'right'
            }
          />
        </motion.div>
      ))}
    </>
  );
};

export default MotionImageText;
