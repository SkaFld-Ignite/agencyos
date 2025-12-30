import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    });
  }

  // Placeholder for enrichment logic
  // In a real implementation, you would call Clearbit, PeopleDataLabs, etc.
  
  // Simulating network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock response based on email domain
  const domain = email.split('@')[1];
  const namePart = email.split('@')[0];
  
  const mockData = {
    first_name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
    last_name: 'Doe', // Generic last name for mock
    company_name: domain ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) : 'Unknown Corp',
    job_title: 'CEO', // Everyone is a CEO in our mock world
    linkedin_url: `https://linkedin.com/in/${namePart}`,
    twitter_handle: `@${namePart}`
  };

  return mockData;
});
