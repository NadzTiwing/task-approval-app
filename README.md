# Task Approval App

A task approval system that allows managers to create, update, and delete tasks and send approval requests via email links. Recipients can approve or reject tasks through secure, tokenized links without requiring login.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Database & Auth)
- SendGrid (Email Service)
- Tailwind CSS
- shadcn/ui Components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn
- Supabase account
- SendGrid account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
NEXT_PUBLIC_APP_URL=your_app_url
```

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/task-approval-app.git
cd task-approval-app
```

2. Install dependencies

```
npm install
```

3. Create a Supabase project and get the credentials

### Supabase Setup
3.a. Set up the database table in Supabase:

- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Create a new query and paste the following SQL:

```
CREATE TABLE tasks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  task TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
3.b. Turn off Row Level Security (RLS) in Authentication > Configuration > Policies section of your Supabase project settings for testing purposes

4. Create a SendGrid account and get the credentials
### SendGrid Setup
4.a. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
4.b. Verify your account and complete domain authentication:
   - Go to Settings > Sender Authentication
   - Choose Domain Authentication
   - Follow the steps to verify your domain

4.c. Create an API Key:
   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" with at least "Mail Send" permissions
   - Copy the generated API key (you won't be able to see it again)
   - Add it to your `.env.local` file as `NEXT_PUBLIC_SENDGRID_API_KEY`

4.d. Set up a Sender Identity:
   - Go to Settings > Sender Authentication
   - Click on "Verify a Single Sender"
   - Fill in the required information
   - Verify your email address
   - Add it to your `.env.local` file as `NEXT_PUBLIC_SENDGRID_SENDER`
4.e. Test your integration:
   - Make sure your sender email matches the verified email in SendGrid
   - Start with the sandbox environment if available
   - Monitor your email activity in the SendGrid dashboard


5. Run the development server

```
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser


### Live Demo

<!-- [Task Approval App](https://task-approval-app-one.vercel.app/) -->



