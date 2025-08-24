# Overview

YBYMythBust is a modern blog platform designed to debunk myths and misconceptions across various topics including health, science, and history. The application provides a content management system for publishing evidence-based articles, categorizing content, and engaging readers through social sharing features. The platform emphasizes critical thinking and scientific analysis to separate fact from fiction.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**React SPA with TypeScript**: The client is built as a single-page application using React 18 with TypeScript for type safety. The application uses Wouter for client-side routing instead of React Router, providing a lightweight navigation solution.

**UI Component System**: Implements Radix UI primitives with shadcn/ui components for a consistent design system. The styling is handled through Tailwind CSS with a custom theme supporting both light and dark modes.

**State Management**: Uses TanStack Query (React Query) for server state management, caching, and synchronization. Local state is managed through React hooks without additional state management libraries.

**Build System**: Vite serves as the build tool and development server, configured with hot module replacement and TypeScript support. The build process outputs static assets to a dist/public directory.

## Backend Architecture

**Express.js REST API**: The server implements a traditional REST API using Express.js with TypeScript. Routes are organized by functionality (posts, categories, admin) with clear separation of concerns.

**File-Based Content Storage**: Uses a hybrid storage approach with markdown files for blog posts and JSON files for categories. This provides version control benefits and easy content migration while maintaining simplicity.

**Authentication**: Implements simple bearer token authentication for admin functions using environment variables. No complex user management or session handling is required.

**Middleware Stack**: Includes request logging, JSON parsing, and error handling middleware. Custom middleware tracks API response times and captures response data for debugging.

## Data Storage Solutions

**Content Management**: Blog posts are stored as markdown files with frontmatter metadata in a content/posts directory. Categories are managed in a JSON file for quick access and modification.

**Database Schema**: Configured for PostgreSQL using Drizzle ORM with schema definitions for posts and categories tables. Migration support is available through drizzle-kit.

**File Structure**: Content is organized with clear separation between posts and static assets, enabling easy backup and version control of content.

## External Dependencies

**Neon Database**: Configured as the PostgreSQL provider through the @neondatabase/serverless package, allowing serverless database connections.

**Google Analytics**: Integrated for tracking page views, user engagement, and content performance. Requires VITE_GA_MEASUREMENT_ID environment variable.

**AdSense Integration**: Placeholder components are positioned throughout the application for monetization through Google AdSense. Ad placements include header banners, sidebar rectangles, and footer placements.

**Social Media APIs**: Social sharing functionality integrates with Twitter, Facebook, and WhatsApp sharing APIs. Native sharing API is supported where available.

**SEO Optimization**: Meta tags, Open Graph properties, and structured data are dynamically generated for each page. Robots.txt and ads.txt files are configured for search engine and advertising compliance.

**Font Loading**: Google Fonts integration for Inter, Fira Code, and other typography options with optimized loading strategies.