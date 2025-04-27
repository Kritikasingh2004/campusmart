# CampusMart Project Development Requirements (PDR)

## Quick Start

Choose your reference section based on development needs:

- **Basic**: Authentication setup and user profiles
- **Medium**: Listings management (create, edit, delete)
- **Medium**: Search and filtering functionality
- **Complex**: Image upload and management
- **Complex**: User dashboard with statistics

## Project Structure Overview

```
campusMart/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication routes
│   ├── api/              # API routes
│   ├── create-listing/   # Create listing page
│   ├── create-profile/   # Create profile page
│   ├── dashboard/        # User dashboard
│   ├── edit-listing/     # Edit listing page
│   ├── examples/         # Example components
│   ├── listing/          # Listing details page
│   ├── profile/          # User profile page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── listings/         # Listing components
│   ├── profile/          # Profile components
│   └── ui/               # UI components (ShadCN)
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── validators/       # Zod validators
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
    └── supabase/         # Supabase client utilities
```

## Quick Checklist

- [ ] Set up Supabase project and authentication
- [ ] Implement database schema with RLS policies
- [ ] Create authentication flow with Google OAuth
- [ ] Develop user profile management
- [ ] Build listings CRUD functionality
- [ ] Implement search and filtering
- [ ] Create responsive UI components
- [ ] Set up image upload and storage
- [ ] Develop dashboard with user statistics
- [ ] Implement form validation with Zod

## Common Gotchas

**Authentication issues?**
- Ensure callback URL is set correctly in Supabase and Google OAuth
- Check that middleware is properly configured
- Verify that auth cookies are being handled correctly

**Database access problems?**
- Verify RLS policies are correctly set up
- Check that user is authenticated before database operations
- Ensure foreign key relationships are properly defined

**Image upload not working?**
- Confirm remotePatterns in next.config.js are correct
- Check that Supabase storage buckets are properly configured
- Verify file size limits and allowed file types

**Component not showing?**
- Check that the component is properly exported and imported
- Verify that the component is wrapped in the correct providers
- Ensure that the component is receiving the expected props

## 1. Authentication Implementation

### Supabase Setup

1. Create a new Supabase project
2. Configure Google OAuth provider:
   ```
   Authentication > Providers > Google
   - Enable Google auth
   - Add Google client ID and secret
   - Set callback URL to http://localhost:3000/callback
   - Add same domain to Google OAuth authorized redirect URIs
   ```
3. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Authentication Flow

1. User clicks "Sign in with Google" button
2. User is redirected to Google for authentication
3. After successful authentication, user is redirected to `/callback` route
4. Callback route exchanges OAuth code for session
5. Callback checks if user has a profile in the `users` table
6. If no profile exists, one is created automatically
7. User is redirected to dashboard or originally requested protected route

### Protected Routes

The following routes require authentication:
- `/dashboard`
- `/create-listing`
- `/edit-listing`
- `/profile`
- `/create-profile`

### Implementation Files

- **Middleware**: `middleware.ts` - Handles route protection
- **Callback Route**: `app/(auth)/callback/route.ts` - Processes OAuth callback
- **Auth Context**: `contexts/auth-context.tsx` - Manages auth state
- **Auth Components**: `components/auth/` - Login/logout buttons, guards

## 2. Database Schema

### Users Table

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### Listings Table

```sql
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  location TEXT,
  category TEXT,
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### Row Level Security (RLS)

Example policies for listings table:
```sql
-- Allow users to view all listings
CREATE POLICY "Anyone can view listings" ON public.listings
  FOR SELECT USING (true);

-- Allow users to insert their own listings
CREATE POLICY "Users can insert their own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Users can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);
```

## 3. Frontend Implementation

### Component Structure

**Layout Components**:
- `Navbar`: Top navigation with auth state
- `Footer`: Site footer with links
- `Container`: Responsive container for content
- `PageHeader`: Consistent page headers

**Listing Components**:
- `ListingForm`: Form for creating/editing listings
- `ProductCard`: Card display for listing in grid
- `ListingDetail`: Detailed view of a listing
- `Filters`: Category and location filters

**Profile Components**:
- `ProfileForm`: Form for editing user profile
- `Avatar`: User avatar with upload capability
- `ProfileCard`: Display of user information

**UI Components**:
- ShadCN UI components (Button, Card, Dialog, etc.)
- Custom UI components built on Radix primitives

### Form Validation

Use Zod schemas for form validation:

```typescript
// Example schema for listing form
export const listingFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  image_url: z.string().optional(),
});
```

### Image Handling

Configure Next.js for image optimization:

```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
      // Add Supabase storage domain
    ],
    dangerouslyAllowSVG: true,
  },
};
```

## 4. State Management

Use React Context for global state:

```typescript
// Example auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Authentication logic
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 5. API Routes

Structure API routes for server-side operations:

```typescript
// Example API route for listings
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  
  const supabase = await createClient();
  
  let query = supabase.from("listings").select("*");
  
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  
  if (location && location !== "all") {
    query = query.eq("location", location);
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
```

## 6. Styling Guidelines

### Tailwind CSS

Use Tailwind classes following the theme:

```jsx
// DO: Use theme classes
className="text-foreground bg-background"
className="rounded-lg border bg-card text-card-foreground"

// DON'T: Use custom colors directly
className="text-gray-500 bg-[#4CAF50]" // Avoid this
```

### Component Examples

```jsx
// Button styling
<Button
  variant="default"
  className="rounded-full"
>
  Submit
</Button>

// Card styling
<Card className="overflow-hidden">
  <CardHeader>
    <CardTitle>Listing Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

## 7. Testing Strategy

### Unit Tests

Focus on testing:
- Form validation logic
- Utility functions
- Custom hooks

### Integration Tests

Test key user flows:
- Authentication process
- Creating and editing listings
- Searching and filtering

### E2E Tests

Test complete user journeys:
- Sign up, create profile, create listing
- Search, filter, view listing details
- Edit profile and manage listings

## 8. Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Set up build settings:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### Environment Variables

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 9. Performance Optimization

- Use Next.js Image component for optimized images
- Implement pagination for listings
- Use React.memo for expensive components
- Optimize database queries with proper indexes
- Implement caching strategies where appropriate

## 10. Accessibility Guidelines

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Maintain sufficient color contrast
- Provide alt text for images
- Test with screen readers
- Follow ARIA best practices

## Reference Apps by Complexity

**Simple**:
- Authentication and user profiles
- Basic CRUD operations

**Medium**:
- Search and filtering
- Form validation with complex schemas
- Image upload and management

**Complex**:
- Real-time updates
- Advanced filtering and sorting
- Analytics and statistics
- Chat functionality (future enhancement)

Choose the reference section that most closely matches your current development needs.
