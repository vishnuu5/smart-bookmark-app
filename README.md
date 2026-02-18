# Smart Bookmark App

A modern, real-time bookmark management application built with Next.js 16, Supabase, and Google OAuth. Organize, manage, and access your favorite links with real-time synchronization across devices.

## Features

- **Google OAuth Authentication** - Secure login with Google (no email/password)
- **Private Bookmarks** - Each user's bookmarks are completely private and isolated
- **Add & Manage Bookmarks** - Create, edit, and delete bookmarks with titles, URLs, descriptions, and categories
- **Category Organization** - Organize bookmarks by categories like Work, Learning, Entertainment, Tools, etc.
- **Smart Search** - Search across bookmark titles, descriptions, and URLs in real-time
- **Real-time Updates** - Bookmarks sync instantly across multiple tabs and devices
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Beautiful UI** - Clean, modern interface with smooth interactions
- **Quick Links** - Open bookmarks directly from the app

## Tech Stack

- **Framework**: Next.js - React framework with App Router
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime
- **Language**: JavaScript (ES6+)
- **Styling**: TailwindCSS
- **Deployment**: Vercel

## Git Clone
```bash
https://github.com/vishnuu5/smart-bookmark-app.git
```

## Demo Project

[View Demo](https://smart-bookmark-app-opal-six.vercel.app)
------------------------------------------------
[Video Demo]()
## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm package manager
- Supabase account and project

### 1. Set up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Authentication**
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials (create in Google Cloud Console)
   - Add your site URL to authorized redirect URLs

3. **Create Database Schema**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase/schema.sql`

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

## Deployment on Vercel

### 1. Prepare for Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M master
   git remote add origin 
   git push -u origin master
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Configure OAuth Redirect

In your Google Cloud Console:
- Add `https://your-vercel-app.vercel.app/auth/callback` to authorized redirect URLs
- Add `http://localhost:3000/auth/callback` for local development

## How to Use

### Authentication
1. Click **"Sign in with Google"** in the header
2. Complete the Google OAuth flow
3. You'll be redirected back to the app with your profile

### Adding a Bookmark
1. Sign in with your Google account
2. Click the **"+ Add Bookmark"** button in the left sidebar
3. Fill in the bookmark details:
   - **Title**: Name of your bookmark
   - **URL**: Full web address (with or without https://)
   - **Category**: Select from predefined categories
   - **Description**: Optional notes about the bookmark
4. Click **"Save Bookmark"**

### Managing Bookmarks
- **Search**: Use the search bar at the top to find bookmarks
- **Filter by Category**: Click a category in the left sidebar
- **Open Link**: Click "Open" button to visit the bookmark
- **Edit**: Click the pencil icon to edit bookmark details
- **Delete**: Click the X button to remove a bookmark

### Real-time Features
- Open the app in multiple tabs
- Add/edit/delete a bookmark in one tab
- Changes appear instantly in all other tabs
- Works across multiple devices when signed in

### Categories

Default categories included:
- General
- Work
- Learning
- Entertainment
- Tools
- News

More categories will appear automatically as you add bookmarks to new categories.

## Security Features

- **Row Level Security (RLS)**: Users can only access their own bookmarks
- **OAuth Authentication**: Secure Google OAuth integration
- **Private Data**: All bookmark data is isolated per user
- **No Password Storage**: Uses Google OAuth, no password management needed

## Database Schema

The app uses a single `bookmarks` table with:
- `id`: UUID primary key
- `user_id`: Foreign key to auth.users (RLS enforced)
- `title`: Bookmark title
- `url`: Bookmark URL
- `description`: Optional description
- `category`: Bookmark category
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Problems Faced & Solutions

### Challenge 1: Supabase Integration with Next.js App Router
**Problem**: Supabase auth helpers were deprecated and incompatible with Next.js 16 App Router.
**Solution**: 
- Used direct Supabase client instead of deprecated auth helpers
- Implemented custom auth service with proper session management
- Created manual OAuth callback handler in `app/auth/callback/route.js`

### Challenge 2: Real-time Subscriptions
**Problem**: Implementing real-time updates without complex state management.
**Solution**:
- Used Supabase real-time subscriptions with user-specific filtering
- Implemented automatic re-fetching on database changes
- Added proper subscription cleanup to prevent memory leaks

### Challenge 3: Environment Variables in Development
**Problem**: `.gitignore` blocked creation of `.env.local` and `.env.example`.
**Solution**:
- Created `lib/supabase.js` with fallback values
- Provided clear setup instructions in README
- Used environment variables with sensible defaults

### Challenge 4: Row Level Security (RLS)
**Problem**: Ensuring users can only access their own bookmarks.
**Solution**:
- Implemented comprehensive RLS policies for all CRUD operations
- Added user_id filtering at database level
- Used auth.uid() for secure user identification

### Challenge 5: OAuth Callback Handling
**Problem**: Handling OAuth redirects properly in Next.js App Router.
**Solution**:
- Created dedicated route handler for OAuth callbacks
- Implemented proper URL handling for development and production
- Added error handling for failed OAuth flows

## API Endpoints

### Authentication
- `GET /auth/callback` - OAuth callback handler

### Database Operations
All database operations are handled through Supabase client with RLS:
- `bookmarkService.getUserBookmarks(userId)` - Get user's bookmarks
- `bookmarkService.addBookmark(bookmark)` - Add new bookmark
- `bookmarkService.updateBookmark(id, updates)` - Update bookmark
- `bookmarkService.deleteBookmark(id)` - Delete bookmark
- `bookmarkService.subscribeToUserBookmarks(userId, callback)` - Real-time subscription

## Performance Optimizations

- Real-time updates only for authenticated users
- Efficient database queries with proper indexing
- Client-side filtering for search and categories
- Minimal bundle size with tree shaking
- Automatic subscription cleanup

## Troubleshooting

### Authentication Issues
- Ensure Google OAuth is properly configured in Supabase
- Check that redirect URLs match your deployment domain
- Verify environment variables are set correctly

### Real-time Not Working
- Check browser console for WebSocket errors
- Ensure RLS policies are properly set up
- Verify user is authenticated

### Database Errors
- Run the schema.sql in Supabase SQL Editor
- Check RLS policies are enabled
- Verify user permissions

### Deployment Issues
- Ensure all environment variables are set in Vercel
- Check that OAuth redirect URLs include your domain
- Verify Google OAuth configuration

## License

MIT - Free to use and modify