import Image from 'next/image';
import { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';


export const metadata: Metadata = {
  title: 'About Us | Holy Church',
  description: 'Learn about our church history, mission, vision, and the team that makes it all possible.',
};

export default function AboutUsPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <Image
          src="/assets/images/carousel/01.jpeg"
          alt="Church building"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            About Holy Church
          </h1>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <SectionTitle>Our Mission</SectionTitle>
              <p className="text-gray-600 leading-relaxed">
                To spread the love of Christ, build a community of believers, and serve
                our neighbors with compassion and grace. We strive to create an
                inclusive environment where everyone can experience God&apos;s presence
                and grow in their faith journey.
              </p>
            </div>
            <div className="space-y-6">
              <SectionTitle>Our Vision</SectionTitle>
              <p className="text-gray-600 leading-relaxed">
                To be a beacon of hope and transformation in our community, leading
                people to Christ and equipping them to live out their God-given
                purpose. We envision a church that bridges generations and cultures,
                united in worship and service.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* History */}
      <section className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <SectionTitle className="text-center">Our History</SectionTitle>
            <p className="text-gray-600 leading-relaxed">
              Founded in 1995, Holy Church began as a small gathering of believers
              committed to authentic worship and community service. Over the years,
              we&apos;ve grown into a vibrant congregation while maintaining our core
              values of faith, fellowship, and service.
            </p>
            <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
              <Image
                src="/assets/images/carousel/02.jpg"
                alt="Church history"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <Container>
          <SectionTitle className="text-center mb-12">Our Leadership Team</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader) => (
              <div key={leader.name} className="text-center space-y-4">
                <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{leader.name}</h3>
                  <p className="text-gray-600">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16">
        <Container>
          <SectionTitle className="text-center mb-12">Our Core Values</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 bg-white rounded-lg shadow-sm space-y-4"
              >
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

const leaders = [
  {
    name: 'Pastor John Smith',
    role: 'Senior Pastor',
    image: '/assets/images/team/1.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Worship Leader',
    image: '/assets/images/team/2.jpg',
  },
  {
    name: 'Michael Brown',
    role: 'Youth Pastor',
    image: '/assets/images/team/3.jpg',
  },
];

const values = [
  {
    title: 'Biblical Teaching',
    description: 'We are committed to teaching God\'s Word faithfully and applying it to our daily lives.',
  },
  {
    title: 'Community',
    description: 'We believe in building strong relationships and supporting one another in our faith journey.',
  },
  {
    title: 'Service',
    description: 'We are dedicated to serving our community and showing God\'s love through practical actions.',
  },
];
