# TaskFlow - Project Management and Time Tracking Application

## Overview

TaskFlow is a comprehensive project and task management application built with a modern full-stack architecture. It provides Kanban-style project management, time tracking capabilities, team collaboration features, and Power BI export functionality. The application follows a client-server architecture with a React frontend and Express backend, utilizing PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Drag & Drop**: React DnD for Kanban board interactions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging
- **Development**: Hot reloading with Vite integration

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Schema**: Shared TypeScript schema definitions with Zod validation

## Key Components

### Authentication System
- **Mock Authentication**: Currently implements demo authentication with localStorage
- **Supabase Ready**: Configured for Supabase integration (client setup exists)
- **Session Management**: Local storage-based session persistence
- **Protected Routes**: Route-level authentication guards

### Project Management
- **Projects**: Full CRUD operations with owner-based access control
- **Project Members**: Team collaboration with role-based access
- **Project Status**: Active, completed, on-hold, cancelled states
- **Color Coding**: Visual project identification system

### Task Management
- **Kanban Board**: Drag-and-drop task management with status columns
- **Task Hierarchy**: Support for subtasks and task dependencies
- **Priority System**: Urgent, high, medium, low priority levels
- **Status Tracking**: Todo, in-progress, review, done workflow
- **Due Dates**: Task scheduling with overdue detection
- **Time Estimates**: Estimated vs actual time tracking

### Time Tracking
- **Active Timers**: Real-time timer functionality
- **Time Entries**: Detailed time logging per task
- **Daily Summaries**: Aggregated time tracking views
- **Automatic Calculation**: Minute-based time storage with hour/minute display

### Data Export
- **Power BI Integration**: JSON export functionality for business intelligence
- **Structured Data**: Formatted exports for external analysis tools

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with standardized response formats
2. **Error Handling**: Centralized error management with user-friendly messages
3. **Caching**: React Query manages client-side caching and synchronization
4. **Real-time Updates**: Optimistic updates with background synchronization

### Database Operations
1. **Type Safety**: Drizzle ORM ensures compile-time type checking
2. **Transactions**: Atomic operations for data consistency
3. **Relationships**: Foreign key constraints maintain referential integrity
4. **Indexing**: Optimized queries with proper database indexes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **@supabase/supabase-js**: Authentication and real-time features (configured)
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **react-hook-form**: Form state management
- **wouter**: Lightweight routing
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class management
- **react-dnd**: Drag and drop functionality

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds optimized React application to `dist/public`
2. **Backend Build**: esbuild compiles TypeScript server to `dist/index.js`
3. **Static Assets**: Frontend served as static files in production

### Environment Configuration
- **Development**: Vite dev server with Express API proxy
- **Production**: Express serves both API and static frontend
- **Database**: PostgreSQL connection via environment variable

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- `VITE_SUPABASE_URL`: Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (optional)

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Vite handles asset bundling and optimization
- **Caching**: React Query implements intelligent caching strategies
- **Database**: Connection pooling with Neon serverless PostgreSQL

The application is designed for easy deployment on platforms like Replit, Vercel, or traditional hosting environments with minimal configuration required.