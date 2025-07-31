# AI Trading Assistant

## Overview

AI Trading Assistant is a full-stack trading platform that combines automated AI-driven trading analysis with manual trading capabilities. The application features real-time market analysis, trade journaling, performance analytics, and AI-powered insights to help traders make informed decisions. It provides a comprehensive dashboard for monitoring trading performance, managing wallets, and analyzing market conditions with intelligent recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and building
- **Routing**: Wouter for client-side routing with support for SPA navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent styling
- **Styling**: Tailwind CSS with custom trading-specific color variables and dark theme support
- **Real-time Updates**: WebSocket integration for live trading data and notifications
- **Charts**: Recharts library for performance visualization and analytics displays

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with WebSocket support for real-time communications
- **Development**: Hot module replacement (HMR) with Vite integration for seamless development
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Custom request/response logging with duration tracking

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Drizzle migrations with shared TypeScript schema definitions
- **Data Validation**: Zod integration with Drizzle for runtime type checking and validation

### Database Schema Design
- **Users**: Authentication and user management
- **Trading Sessions**: Daily trading session tracking with trade count limits
- **Trades**: Comprehensive trade records with AI analysis metadata
- **Wallet**: Balance tracking with P&L calculations across different time periods
- **Settings**: User preferences including risk management and notification settings
- **Market Analysis**: AI-generated market condition assessments
- **AI Learning**: Machine learning pattern storage and confidence tracking
- **Alerts**: Real-time notification system for trading opportunities and warnings

### AI and Analytics Engine
- **AI Analysis**: Simulated AI engine for market analysis with confidence scoring
- **Market Analyzer**: Real-time market condition assessment with volatility tracking
- **Pattern Recognition**: Time-based heatmap analysis for optimal trading windows
- **Performance Analytics**: Win rate calculation, P&L tracking, and risk management metrics

### Real-time Communication
- **WebSocket Server**: Dedicated WebSocket server for live data streaming
- **Event Broadcasting**: Real-time updates for trade changes, session status, and market alerts
- **Client Integration**: React hooks for WebSocket connection management and message handling

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM with PostgreSQL dialect for database operations
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Design System**: shadcn/ui component collection with Tailwind CSS integration
- **Charts**: Recharts for responsive data visualization
- **Date Handling**: date-fns for date formatting and manipulation

### Development Tools
- **Build Tool**: Vite with React plugin for fast development and optimized builds
- **TypeScript**: Full TypeScript support across client, server, and shared code
- **Linting**: ESBuild for server-side bundling and production builds
- **Development Plugins**: Replit-specific plugins for error overlay and development experience

### Form and Validation
- **Form Management**: React Hook Form with Zod resolver for type-safe form handling
- **Validation**: Zod for runtime type validation and schema definition
- **Form Components**: Integration with shadcn/ui form components for consistent UX

### Third-party Integrations
- **Discord Notifications**: Discord webhook integration for trading alerts and notifications
- **Market Data**: Placeholder for real market data integration (currently simulated)
- **WebSocket**: Native WebSocket implementation for real-time data streaming