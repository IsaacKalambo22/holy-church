import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const FrequentlyAskedQuestions = () => {
  const sections = [
    {
      id: '1',
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for all purchases.',
    },
    {
      id: '2',
      question: 'How do I track my order?',
      answer:
        'You can track your order using the tracking link provided in your confirmation email.',
    },
    {
      id: '3',
      question:
        'Do you offer international shipping?',
      answer:
        'Yes, we ship to over 50 countries worldwide.',
    },
    {
      id: '4',
      question:
        'Can I change my shipping address?',
      answer:
        'You can update your shipping address before the order is processed.',
    },
    {
      id: '5',
      question:
        'What payment methods do you accept?',
      answer:
        'We accept credit cards, PayPal, and other major payment methods.',
    },
  ];

  return (
    <div className='flex w-full items-center flex-col gap-4'>
      <h2 className='blue_gradient'>
        Frequently asked questions
      </h2>
      <Accordion
        type='multiple'
        className='w-full'
      >
        <Card className='p-4 shadow-none'>
          <h1 className='text-gray-700 text-xl text-center font-bold'>
            Destiny Questions
          </h1>
          <AccordionItem
            value='item1'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              Is Destiny Pre-Destined,
              Pre-Determined, or Do We Create It
              Ourselves?{' '}
            </AccordionTrigger>
            <AccordionContent className=''>
              To effectively address this
              question, we must consider the
              fundamental principle:
              <br />
              <br />
              "Nothing Exists by Itself."
              <br />
              <br />- It is crucial to recognize
              that everything that exists today
              once did not. If something once was
              not, then the key question arises:
              "Who initiated the start of
              everything?"
              <br />
              <br />- In seeking an answer, we
              acknowledge the undeniable truth:
              "We were created, and therefore, our
              destinies are both pre-destined and
              pre-determined". As a result, we
              neither possess the authority nor
              bear the responsibility of creating
              our own destinies.
              <br />
              <br />
              However, what we do have is the
              responsibility to rediscover our
              destinies—to align ourselves with
              the purpose for which we were
              created and to walk in the path
              already set before us.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item2'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How can I know if I am on the right
              path to fulfilling my destiny?
            </AccordionTrigger>
            <AccordionContent className=''>
              If nothing exists by itself, then it
              follows that we all have a
              source—and that source ultimately
              determines who we truly are.
              <br />
              <br />
              To discern whether we are on the
              right path toward fulfilling our
              destinies, we must first be clear
              about who we recognize as our
              Creator, the very source that
              defines our identity and purpose.
              Our understanding of this source
              shapes what we believe about
              ourselves and, in turn, determines
              whether we are truly walking in
              alignment with our destiny. <br />
              <br />
              Ultimately, the certainty of
              fulfillment comes only when we have
              genuinely reconnected with the
              mindset of our true Creator,
              aligning our lives with the purpose
              for which we were originally
              designed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item3'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              Can destiny change based on the
              choices we make?
            </AccordionTrigger>
            <AccordionContent className=''>
              As humans, we are endowed with free
              will, which inherently means we are
              capable of making decisions.
              However, the question arises: Within
              what context do these choices
              operate?
              <br />
              <br />
              To address this, we must acknowledge
              the truth that, if we were created
              and that our destinies are both
              pre-destined and pre-determined, we
              must accept the fundamental
              principle that all pre-determined
              things operate within fixed
              laws—laws that no human can alter,
              and this includes our destinies.
              <br />
              <br />
              While we are indeed responsible for
              making choices, these choices do not
              alter our predestined identities.
              Rather, they unfold within the
              framework of our already established
              paths, aligned with our true
              purpose.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item5'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I overcome obstacles that
              seem to block my destiny?
            </AccordionTrigger>
            <AccordionContent className=''>
              To overcome obstacles that may
              appear to block your destiny, it is
              essential to remain constantly
              connected to the Source for
              guidance. Understanding that we were
              created with a predetermined path,
              challenges are not mere hindrances
              but rather, opportunities for
              growth.
              <br />
              <br />
              By developing resilience and viewing
              obstacles as valuable learning
              experiences, we can navigate through
              them with greater strength and
              clarity.
              <br />
              <br />
              This approach aligns with the
              understanding that our destinies are
              pre-determined, and every challenge
              we face plays a role in revealing
              deeper insights and lessons,
              ultimately bringing us closer to
              fulfilling our true purpose.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item4'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              What role does faith or spirituality
              play in shaping destiny?
            </AccordionTrigger>
            <AccordionContent className=''>
              To address this, we must begin with
              the fundamental principle:
              "Everything starts and ends with the
              Creator."
              <br />
              <br />
              While we are intelligent beings with
              the capacity for self-determination,
              the undeniable truth is that, we are
              not all-knowing—only the Creator
              holds complete knowledge.
              <br />
              <br />
              The Creator reveals the knowledge of
              our destinies in phases, and this
              highlights the importance of
              recognizing who He is and
              cultivating a meaningful
              relationship with Him. It is
              therefore within this relationship
              that faith and spirituality play a
              pivotal role.
              <br />
              <br />
              By maintaining a strong connection
              with the Creator, we are granted the
              opportunity to understand and
              navigate beyond the limits of our
              own capacity.
              <br />
              <br />
              Spirituality, therefore, offers
              guidance, clarity, and strength,
              enabling us to pursue our destinies
              with conviction, especially during
              times of uncertainty.
            </AccordionContent>
          </AccordionItem>

          <h1 className='text-gray-700 mt-3 text-xl text-center font-bold'>
            Identity Questions
          </h1>
          <AccordionItem
            value='item6'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I discover my true identity?
            </AccordionTrigger>
            <AccordionContent className=''>
              To discover your true identity is
              tied to the idea of personal sense
              of Self-Discovery,
              <br />
              <br />
              it is essential to first acknowledge
              the principle that "nothing exists
              by itself"—everything, including
              you, has a Source. Understanding
              this, your true identity is
              intricately tied to the Creator, who
              defines and shapes who you are.{' '}
              <br />
              <br />
              The journey to uncovering your true
              identity begins by seeking clarity
              on who your Creator is, for only
              through this relationship can you
              access the truth of your purpose and
              potential. As you reconnect with the
              Creator’s mindset, you align
              yourself with the identity that has
              been predestined for you.
              <br />
              <br />
              Through self-reflection, mentorship,
              and guidance, you begin to recognize
              the unique attributes embedded
              within you and results in
              self-awareness. Your true identity
              is not something you create but
              something you rediscover, by
              aligning your actions, choices, and
              beliefs with the divine design
              intended for your life.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item7'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              What factors shape a person’s
              identity?
            </AccordionTrigger>
            <AccordionContent className=''>
              A person’s identity is shaped by
              several key factors, all of which
              are deeply interconnected with the
              principle that "nothing exists by
              itself" —meaning every aspect of who
              we are is influenced by a greater
              Source, though this source does not
              always mean we are all abided to the
              true source. The following factors
              play a central role in shaping
              identity:
              <br />
              <br />
              1. The Creator’s Design: Our true
              identity is ultimately determined by
              our Creator, who designs us with
              purpose and intent. Understanding
              who the Creator is and reconnecting
              with His vision for us helps reveal
              our core identity.
              <br />
              <br />
              2. Cultural and Environmental
              Influences: The environment in which
              we are raised, including cultural,
              familial, and societal influences,
              shapes our perceptions, beliefs, and
              values. These external factors
              interact with our innate traits,
              helping to form the lens through
              which we view the world.
              <br />
              <br />
              3. Experiences and Choices: Life
              experiences—both positive and
              challenging—contribute significantly
              to our identity. The choices we
              make, especially in response to
              obstacles or opportunities, refine
              and redefine our sense of self.
              While we cannot change our
              predetermined identity, our
              decisions influence how we express
              it.
              <br />
              <br />
              4. Mentorship and Relationships: The
              people we surround ourselves
              with—mentors, friends, family—serve
              as reflections and guides on our
              journey of self-discovery. Their
              influence, whether supportive or
              challenging, helps reveal and shape
              aspects of our identity.
              <br />
              <br />
              5. Faith and Spirituality: Spiritual
              beliefs and faith practices act as a
              foundation for understanding one’s
              purpose and true identity. By
              reconnecting with the Creator’s
              mindset and nurturing a relationship
              with Him, we align more fully with
              the identity intended for us.
              <br />
              <br />
              6. Self-Reflection and Awareness: An
              ongoing process of self-discovery
              through introspection, learning, and
              personal growth helps us uncover the
              deepest aspects of our identity. The
              more we explore our values,
              passions, and purpose, the clearer
              our true identity becomes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item8'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How can I separate my true identity
              from societal expectations?
            </AccordionTrigger>
            <AccordionContent className=''>
              To separate your true identity from
              societal expectations, it’s
              essential to first understand that
              your true identity is not shaped by
              external pressures but by the
              Creator's design. The principle that
              "nothing exists by itself" implies
              that your true identity is rooted in
              a purpose and vision that transcends
              societal norms and expectations.
              <br />
              <br />
              Here are a few key steps to help you
              separate your true identity:
              <br />
              <br />
              1. Reconnect with the Creator’s
              Vision: Recognizing that your true
              identity is both predestined and
              pre-determined by the Creator is the
              first step. Society may impose
              standards and ideals, but your
              identity is not defined by them. By
              seeking a deeper connection with the
              Creator and understanding the
              purpose for which you were created,
              you can gain clarity on what truly
              defines you.
              <br />
              <br />
              2. Identify and Challenge External
              Influences: Societal expectations,
              whether cultural, familial, or
              professional, can often cloud our
              perception of who we are. By
              consciously reflecting on these
              influences, you can identify which
              aspects of your life are guided by
              external pressures rather than your
              true self. Recognize that these
              expectations may not align with your
              predestined purpose and can be set
              aside in favor of what resonates
              with your inner truth.
              <br />
              <br />
              3. Engage in Self-Discovery: Through
              self-reflection, introspection, and
              mentorship, begin to explore what
              truly aligns with your values,
              passions, and abilities. This
              process of rediscovery helps you
              separate what you have been taught
              to believe about yourself, from what
              you genuinely believe to be true
              about your identity.
              <br />
              <br />
              4. Cultivate Resilience and
              Confidence: As you rediscover your
              true identity, it may be challenging
              to face resistance from societal
              expectations. Developing resilience
              and confidence in your uniqueness is
              vital. Trusting in the truth of your
              predestined identity will give you
              the strength to stay true to
              yourself, regardless of external
              pressures.
              <br />
              <br />
              5. Embrace Your Purpose: Understand
              that societal expectations are
              transient, but your true purpose is
              eternal. By embracing your purpose
              and aligning your actions with your
              Creator’s plan for you, you
              naturally separate your true
              identity from societal influences.
              Your actions, choices, and life path
              should reflect the authentic
              identity you have rediscovered,
              rather than conforming to what
              society dictates.
              <br />
              <br />
              <strong>NB:</strong> The key lies in
              on going questioning of external
              influences and embracing
              authenticity over conformity.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item9'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I build confidence in my
              identity when I feel lost?
            </AccordionTrigger>
            <AccordionContent className=''>
              When feeling lost, the key to
              building confidence in your identity
              lies in reconnecting with your
              Creator’s vision for your life.
              Remember, your true identity is both
              predestined and pre-determined, and
              it is rooted in a purpose greater
              than external circumstances. Start
              by engaging in self-reflection and
              seeking guidance from mentors to
              rediscover your core values,
              passions, and strengths.
              <br />
              <br />
              Developing resilience in the face of
              challenges and trusting that your
              identity is part of a larger divine
              plan, will help you regain clarity.
              As you align your actions with your
              Creator’s design, you will build the
              confidence needed to navigate
              uncertainty and confidently walk in
              your true purpose.
              <br />
              <br />
              <strong>NB:</strong> Engage in
              self-discovery, surround yourself
              with supportive people, and affirm
              your strengths
            </AccordionContent>
          </AccordionItem>

          <h1 className='text-gray-700 mt-3 text-xl text-center font-bold'>
            Success Questions
          </h1>
          <AccordionItem
            value='item10'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How can I justify the true
              definition of success?
            </AccordionTrigger>
            <AccordionContent className=''>
              The true definition of success is
              rooted in reclaiming your value in
              the sight of your Creator and
              aligning your life with the purpose
              for which you were pre-determined.
              Success is not solely defined by
              external achievements or societal
              standards, but by walking in
              alignment with your true identity,
              which is deeply connected to your
              Creator's design.
              <br />
              <br />
              To be successful is to rediscover
              your predestined purpose, develop
              resilience in the face of
              challenges, and stay true to your
              authentic self. It involves
              continuously reconnecting with the
              Creator’s vision, using your gifts
              and talents in meaningful ways, and
              fulfilling the unique role you were
              created for.
              <br />
              <br />
              True success is living in harmony
              with your divine purpose and
              expressing your identity in the
              world with confidence and
              conviction.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item11'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I measure true success beyond
              money and achievements?
            </AccordionTrigger>
            <AccordionContent className=''>
              True success goes beyond financial
              gain and external achievements. It
              is found in reconnecting with your
              divine purpose, which is deeply
              rooted in your Creator’s design.
              Success is measured by how well you
              are living in alignment with your
              true identity and making a
              meaningful impact in the world.
              <br />
              <br />
              One key indicator of success is
              doing what you love—not for monetary
              reward, but because it allows you to
              solve problems and serve others. The
              joy comes not from the compensation
              you receive, but from the solutions
              you provide and the value you create
              in the lives of others.
              <br />
              <br />
              Additionally, success can be
              measured by the peace of mind you
              experience, which transcends
              financial wealth. It’s about the
              lasting impact you make through your
              actions, the relationships you
              build, and the positive change you
              foster in others’ lives.
              <br />
              <br />
              True success is found in living
              authentically, staying true to your
              purpose, and contributing to the
              world in a way that aligns with your
              Creator’s vision for you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item12'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              What are the key habits of
              successful people?
            </AccordionTrigger>
            <AccordionContent className=''>
              The key habits of successful people
              are rooted in their ability to align
              with their true identity and
              purpose. Here are some of the
              fundamental habits that contribute
              to their success:
              <br />
              <br />
              <strong>
                1. Self-Awareness and Reflection:
              </strong>{' '}
              Successful people regularly engage
              in self-reflection to reconnect with
              their values, strengths, and
              purpose. They understand their
              predetermined identity and remain
              grounded in the truth of who they
              are.
              <br />
              <br />
              <strong>
                2. Resilience in the Face of
                Challenges:
              </strong>{' '}
              Successful individuals view
              obstacles as opportunities for
              growth. They develop resilience by
              learning from setbacks and using
              them to strengthen their character,
              rather than allowing them to define
              their limitations.
              <br />
              <br />
              <strong>
                3. Focus on Service and Impact:
              </strong>{' '}
              Rather than focusing on financial
              gain or personal achievements,
              successful people prioritize solving
              problems and creating value for
              others. They are driven by the
              desire to make a positive impact.
              <br />
              <br />
              <strong>
                4. Consistency and Discipline:
              </strong>{' '}
              Consistency in actions and
              discipline in pursuit of goals is
              essential. Successful people are
              committed to the process of
              self-discovery and growth, making
              regular efforts to improve and stay
              true to their vision.
              <br />
              <br />
              <strong>
                5. Strong Relationships and
                Mentorship:
              </strong>{' '}
              Successful individuals surround
              themselves with mentors and
              like-minded people who inspire and
              challenge them. They understand the
              importance of collaborating with
              others to fulfill their purpose.
              <br />
              <br />
              <strong>
                6. Faith and Spirituality:
              </strong>{' '}
              A strong spiritual foundation is
              central to success. Successful
              people cultivate a deep relationship
              with their Creator, trusting in the
              divine plan for their lives. Their
              faith provides clarity, guidance,
              and strength in pursuing their
              goals.
              <br />
              <br />
              <strong>
                7. Continuous Learning and Growth:
              </strong>{' '}
              Successful people are committed to
              continuous learning. They recognize
              that personal growth is a lifelong
              journey and seek out opportunities
              to expand their knowledge, skills,
              and understanding in alignment with
              their purpose.
              <br />
              <br />
              By embracing these habits,
              successful people stay aligned with
              their true identity, overcoming
              challenges, and making a meaningful
              impact in the world around them.
              <br />
              <br />
              <strong>NB:</strong> Discipline,
              consistency, adaptability, and a
              growth mindset.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item13'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I stay motivated when
              pursuing success?
            </AccordionTrigger>
            <AccordionContent className=''>
              Staying motivated in the pursuit of
              success is rooted in reconnecting
              with your true identity and purpose.
              Remain focused on the impact you
              want to make, not just the rewards
              or external achievements.
              <br />
              <br />
              Cultivate resilience by viewing
              obstacles as opportunities to grow,
              and stay grounded in the
              understanding that your success is
              part of a greater purpose.
              <br />
              <br />
              Maintaining a strong mindset
              provides guidance and clarity, while
              developing consistency and
              self-discipline helps you stay on
              course.
              <br />
              <br />
              Surround yourself with mentors and
              positive influences who support your
              journey, and continuously reflect on
              the deeper purpose behind your
              efforts. This alignment with your
              true purpose fuels sustained
              motivation and drives you toward
              meaningful success.
              <br />
              <br />
              <strong>NB:</strong> Set clear
              goals, celebrate progress, and stay
              connected to your "why".
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item14'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              Can success be achieved without
              failure?
            </AccordionTrigger>
            <AccordionContent className=''>
              Success is rarely a linear path, and
              failure often plays a crucial role
              in the journey. However, it’s
              important to understand that failure
              is not a reflection of an
              unachievable goal, but rather an
              indicator that something hasn’t been
              properly defined or executed.
              <br />
              <br />
              When failure occurs, it serves as a
              signal to revisit the drawing board
              (preparation phase), allowing us to
              reassess and refine our approach.
              <br />
              <br />
              In this sense, failure is an
              essential part of success — it
              provides the opportunity to realign
              with our true identity and purpose,
              ensuring that we are moving in the
              right direction.
              <br />
              <br />
              Achieving success without failure is
              possible, but it often requires a
              deeper understanding of the path, a
              willingness to learn from setbacks,
              and a commitment to continuous
              self-discovery and growth. True
              success is built upon persistence,
              resilience, and the ability to
              adapt, learning from each step of
              the journey.
              <br />
              <br />
              <strong>NB:</strong> Failure is a
              stepping stone to success—it
              provides lessons and resilience.
            </AccordionContent>
          </AccordionItem>

          <h1 className='text-gray-700 mt-3 text-xl text-center font-bold'>
            Purpose of Existence Questions
          </h1>
          <AccordionItem
            value='item15'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I discover my purpose in
              life?
            </AccordionTrigger>
            <AccordionContent className=''>
              Discovering your purpose in life
              begins with reconnecting with your
              true identity, which is rooted in
              your unique design. To uncover your
              purpose, start by engaging in
              selfreflection and understanding
              that your life’s purpose is not
              something you create, but something
              you rediscover by aligning with the
              vision set for you.
              <br />
              <br />
              Engage in introspection to identify
              your passions, strengths, and
              natural talents, as these often
              provide clues to your purpose. Seek
              guidance from mentors and sources of
              wisdom, as these can offer valuable
              insights and direction. By
              cultivating self-awareness, you gain
              clarity about the unique role you
              are meant to play in the world.
              <br />
              <br />
              Ultimately, discovering your purpose
              involves a journey of
              self-discovery, faith, and alignment
              with your path, trusting that your
              life’s purpose is already waiting
              for you to embrace it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item16'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              Is purpose something I find or
              something I create?
            </AccordionTrigger>
            <AccordionContent className=''>
              Purpose is not something you
              create—it is something you
              rediscover. Your purpose is already
              within you, waiting to be unveiled.
              The journey is about aligning with
              this design rather than attempting
              to invent a purpose of your own.
              <br />
              <br />
              Through self-reflection, personal
              growth, and mentorship, you gain
              clarity on your unique role and how
              to fulfill it.
              <br />
              <br />
              True fulfillment comes from
              embracing what was already set for
              you, rather than constructing
              something based on personal desires
              or societal expectations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item17'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              Can my purpose change over time?
            </AccordionTrigger>
            <AccordionContent className=''>
              In seeking to answer this, the
              fundamental principle is:{' '}
              <strong>
                True purpose is about alignment,
                not reinvention.
              </strong>
              <br />
              <br />
              One's core purpose remains constant
              because it is both predestined and
              pre-determined. However, one's
              understanding and expression of that
              purpose may evolve as they grow in
              self-awareness and alignment with
              their true identity.
              <br />
              <br />
              As one rediscovers more about their
              design, they may find new ways to
              fulfill their purpose, but the
              essence of who they are and why they
              exist does not change.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item18'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              What if I feel like I have no
              purpose?
            </AccordionTrigger>
            <AccordionContent className=''>
              Feeling like you have no purpose
              does not mean you lack one—it simply
              means it has not yet been
              rediscovered. Your purpose is both
              predestined and pre-determined by
              your Creator, meaning it already
              exists within you.
              <br />
              <br />
              The key is to reconnect with your
              true identity by seeking clarity
              through self-reflection, mentorship,
              and spiritual alignment.
              <br />
              <br />
              Purpose is not something you create
              but something you uncover as you
              align with the Creator’s vision for
              your life.
              <br />
              <br />
              <strong>NB:</strong> Start
              small—engage in activities that
              bring fulfillment and clarity will
              follow.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item19'
            className=''
          >
            <AccordionTrigger className='text-[1rem]'>
              How do I align my career with my
              life’s purpose?
            </AccordionTrigger>
            <AccordionContent className=''>
              Aligning your career with your
              life’s purpose begins with
              rediscovering your true identity and
              understanding that your purpose is
              both predestined and pre-determined
              by your Creator.
              <br />
              <br />
              Instead of choosing a career based
              solely on external factors like
              money or status, seek a path that
              reflects your natural gifts,
              passions, and the impact you are
              meant to make.
              <br />
              <br />
              By staying connected to your
              Creator’s vision, pursuing
              meaningful work, and using your
              skills to serve and provide
              solutions, your career becomes a
              vehicle for fulfilling your purpose
              rather than just a means of
              survival. True success comes when
              your work aligns with who you were
              created to be.
              <br />
              <br />
              <strong>NB:</strong> Choose work
              that reflects your values, passions,
              and long-term vision for impact.
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
