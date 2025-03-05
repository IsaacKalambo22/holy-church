import Team, { TeamMember } from './team';

const teamMembers: TeamMember[] = [
  {
    name: 'Peace Alex Makaka',
    role: 'Chief Executive Officer',
    description: `"Failing Through the Means of an Intended Goal, Doesn't Terminate One's Destiny"`,
    imageUrl: '/assets/images/team/6.jpg',
  },
  {
    name: 'Donnex Thyolera Kamsonga',
    role: 'Startup Advisor',
    description: `"Building Start-ups, Creating Legacy"`,
    imageUrl: '/assets/images/team/5.jpg',
  },
  {
    name: 'Christina Phiri',
    role: 'Director of Operations',
    description: `"Global Problem Solving, Through New Ideas and Creative Thinking"`,
    imageUrl: '/assets/images/team/4.jpg',
  },
];

export default function OurTeam() {
  return (
    <div>
      <Team teamMembers={teamMembers} />
    </div>
  );
}
