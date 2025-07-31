# LoomSathi Frontend

A modern, responsive business management application for LoomSathi - a digital solution platform for Malegaon's textile and powerloom industry.

## 🚀 Features

- **Full Business Management**: Complete CRUD operations for Workers, Loans, Expenses, Beams, and Baanas
- **Real-time Dashboard**: Live statistics and activity tracking with animated data visualization
- **Authentication System**: Secure login/signup with JWT token management
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI**: Clean, professional design with smooth animations
- **Performance Optimized**: Fast loading with Next.js and optimized assets
- **Accessibility**: WCAG compliant with proper semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom textile theme
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React hooks with custom contexts
- **API Integration**: Fetch API with environment-based configuration
- **Authentication**: JWT tokens with AuthGuard protection
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
frontend/
├── app/
│   ├── globals.css              # Global styles and TailwindCSS
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main landing page
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── signup/
│   │   └── page.tsx             # Signup page
│   └── dashboard/
│       ├── page.tsx             # Main dashboard
│       ├── workers/
│       │   ├── page.tsx         # Workers list
│       │   └── [id]/
│       │       └── page.tsx     # Worker details
│       ├── loans/
│       │   └── [id]/            # Loan details
│       ├── baana/
│       │   └── page.tsx         # Baana management
│       └── beam/
│           └── page.tsx         # Beam management
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx        # Route protection
│   ├── layout/
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Footer component
│   │   └── ProfileDropdown.tsx  # User profile menu
│   ├── modals/
│   │   ├── EditWorkerModal.tsx  # Worker edit modal
│   │   └── DeleteConfirmationModal.tsx # Delete confirmation
│   ├── sections/
│   │   ├── Hero.tsx             # Hero section
│   │   ├── WhyGoDigital.tsx     # Benefits section
│   │   ├── OurMission.tsx       # Mission section
│   │   ├── Features.tsx         # Features showcase
│   │   ├── GetStarted.tsx       # CTA and pricing
│   │   └── Contact.tsx          # Contact section
│   └── ui/
│       ├── Button.tsx           # Reusable button component
│       ├── Card.tsx             # Card component
│       ├── Container.tsx        # Layout container
│       ├── LoadingSpinner.tsx   # Loading animation
│       ├── ApiLoader.tsx        # API loading wrapper
│       ├── ProgressBar.tsx      # Progress indicator
│       ├── PageTransition.tsx   # Page transition effects
│       └── SmoothNavigation.tsx # Navigation animations
├── contexts/
│   ├── AnimationContext.tsx     # Animation state management
│   └── ApiLoaderContext.tsx     # API loading state
├── hooks/
│   ├── useApiLoader.ts          # API loading hook
│   ├── useNavigationLoader.ts   # Navigation loading
│   └── usePageTransition.ts     # Page transition hook
├── utils/
│   └── formatDate.ts            # Date formatting utilities
├── config/
│   └── animations.ts            # Animation configurations
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 5000

### Environment Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```env
   API_BASE_URL=http://localhost:5000
   ```

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🔐 Authentication

The application uses JWT-based authentication:

- **Login**: Email/password authentication
- **Signup**: User registration with validation
- **AuthGuard**: Protected routes with automatic redirect
- **Token Management**: Automatic token refresh and storage

## 📊 Dashboard Features

### Main Dashboard
- **Real-time Statistics**: Live data from all business entities
- **Recent Activities**: Latest transactions and updates
- **Quick Actions**: Direct access to common operations
- **Responsive Charts**: Visual data representation

### Management Modules
- **Worker Management**: Full CRUD with status tracking
- **Loan Management**: Disbursement and installment tracking
- **Expense Management**: Categorized expense tracking
- **Baana Management**: Stock tracking with date validation
- **Beam Management**: Inventory management with CRUD operations

## 🧪 Testing Instructions

### 1. Authentication Test
- ✅ Login with valid credentials
- ✅ Signup with new user
- ✅ Protected route access
- ✅ Logout functionality
- ✅ Token persistence

### 2. Dashboard Test
- ✅ Dashboard loads with statistics
- ✅ Navigation between modules
- ✅ Real-time data updates
- ✅ Responsive layout

### 3. CRUD Operations Test
- ✅ Create new records
- ✅ Read existing data
- ✅ Update records
- ✅ Delete with confirmation
- ✅ Form validation
- ✅ Error handling

### 4. Responsive Design Test
- **Desktop (1920px+)**: Full layout with all features
- **Laptop (1024px)**: Responsive grid layouts
- **Tablet (768px)**: Mobile menu, stacked layouts
- **Mobile (375px)**: Touch-friendly, hamburger menu

### 5. Performance Test
- ✅ Fast initial load
- ✅ Smooth animations
- ✅ No layout shifts
- ✅ Optimized API calls

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Textile orange (#e8751f)
- **Secondary**: Gray scale (#6c757d)
- **Background**: Warm white (#fef7f0)
- **Text**: Dark gray (#212529)
- **Success**: Green (#28a745)
- **Error**: Red (#dc3545)
- **Warning**: Yellow (#ffc107)

### Typography
- **Headings**: Poppins (Bold)
- **Body**: Inter (Regular)
- **Buttons**: Inter (Semibold)

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Hover effects, shadows
- **Modals**: Animated overlays with backdrop
- **Forms**: Validation with error states
- **Tables**: Responsive data tables

## 🔧 API Integration

### Environment Configuration
The application uses environment variables for API configuration:

```env
API_BASE_URL=http://localhost:5000
```

### API Endpoints
- **Authentication**: `/api/v1/auth/*`
- **Workers**: `/api/v1/workers/*`
- **Loans**: `/api/v1/loans/*`
- **Expenses**: `/api/v1/expenses/*`
- **Baanas**: `/api/v1/baanas/*`
- **Beams**: `/api/v1/beams/*`
- **Dashboard**: `/api/v1/dashboard/*`

### Error Handling
- Network error detection
- Timeout handling
- User-friendly error messages
- Automatic retry for failed requests

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Import the project
3. Set environment variables
4. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables
4. Deploy from Git

### Manual Deployment
```bash
npm run build
npm start
```

## 📈 Performance Optimization

- **Images**: Use Next.js Image component
- **Fonts**: Google Fonts with font-display: swap
- **CSS**: Purged unused styles
- **JavaScript**: Code splitting with Next.js
- **Animations**: Hardware accelerated transforms
- **API**: Optimized requests with caching

## 🔧 Customization

### Adding New Modules
1. Create page in `app/dashboard/`
2. Add API endpoints in backend
3. Create components in `components/`
4. Update navigation

### Modifying API Configuration
1. Update `.env` file
2. Modify API calls in components
3. Test connectivity

### Adding Animations
1. Use Framer Motion for complex animations
2. Add custom CSS animations in `globals.css`
3. Configure in `config/animations.ts`

## 📞 Support

For questions or issues:
- Email: hello@loomsathi.com
- Phone: +91 98765 43210
- Location: Malegaon, Maharashtra, India

## 📄 License

© 2024 LoomSathi. All rights reserved.

---

**Built with ❤️ for Malegaon's Textile Industry** 