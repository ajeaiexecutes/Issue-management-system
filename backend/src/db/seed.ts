import { db } from './index';
import { issues, discussions, analyses } from './schema';
import 'dotenv/config';

async function seed() {
  console.log('Seeding database...');
  
  // Clear existing data (in case of re-seeding)
  await db.delete(analyses);
  await db.delete(discussions);
  await db.delete(issues);

  // Insert Mock Issues
  const insertedIssues = await db.insert(issues).values([
    {
      title: 'Fix Navigation Bar Responsiveness',
      description: 'The navigation bar overflows on mobile devices (width < 375px). Need to convert it into a hamburger menu for smaller screens.',
      status: 'OPEN',
    },
    {
      title: 'Update Authentication Flow',
      description: 'Migrate the current token-based authentication to NextAuth for better security and session management.',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Database Schema Optimization',
      description: 'Add indexes to the issues table to speed up filtering queries based on status and created_at fields.',
      status: 'CLOSED',
    }
  ]).returning();

  // Insert Mock Discussions
  if (insertedIssues.length > 0) {
    const issue1 = insertedIssues[0];
    const issue2 = insertedIssues[1];

    await db.insert(discussions).values([
      {
        issueId: issue1.id,
        authorName: 'Alice Developer',
        content: 'I noticed this too. The logo pushes the links out of the viewport.',
      },
      {
        issueId: issue1.id,
        authorName: 'Bob Designer',
        content: 'We should use the standard slide-in animation for the mobile menu.',
      },
      {
        issueId: issue2.id,
        authorName: 'Alice Developer',
        content: 'NextAuth is a good choice. We can start by setting up the Google provider.',
      }
    ]);
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
