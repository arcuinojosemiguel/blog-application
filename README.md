# Blog Application

A full-stack blog application with user authentication and CRUD operations.

## What This App Does

- Register and login with email/password
- Create, read, update, and delete blog posts
- View blogs with pagination (10 per page)
- Works on mobile, tablet, and desktop

## 🛠 Built With

- **React** - User interface
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Supabase** - Database and authentication
- **Tailwind CSS** - Styling

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy your URL and Key

### 3. Add Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 4. Create Database Table

Go to Supabase SQL Editor and run:

```sql
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blogs_status ON blogs(status);
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active blogs"
  ON blogs FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create blogs"
  ON blogs FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE USING (auth.uid() = author_id);
```

### 5. Run the App

```bash
npm run dev
```

Open http://localhost:5173

## How to Use

1. **Register** - Create an account with email/password
2. **Login** - Sign in with your credentials
3. **Create Blog** - Click "Create Blog" button
4. **View Blogs** - See all blogs on the main page
5. **Edit Blog** - Click "Edit" on your own posts
6. **Delete Blog** - Click "Delete" on your own posts

## Project Structure

```
src/
├── components/     # Reusable components (Navbar, Layout)
├── pages/          # Pages (Login, Register, BlogList, etc.)
├── store/          # Redux state (auth, blogs)
├── lib/            # Supabase setup
└── types/          # TypeScript types
```

## Security

- Only logged-in users can create blogs
- Only blog authors can edit/delete their posts
- Deleted blogs are hidden, not permanently removed
