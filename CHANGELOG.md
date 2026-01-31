# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Production-ready optimizations and best practices
- React.memo implementation for list and table components
- Memoized components: ChecklistItem, NavigationCard, ModalItem
- Split Mutual Fund Calculator into smaller components
- Comprehensive error boundary at root level
- Documentation: SETUP_GUIDE.md, ENV_VARIABLES.md
- Barrel exports for common components
- TypeScript strict mode enforcement
- Accessibility improvements (keyboard navigation, ARIA labels)

### Changed

- SelectionModal now uses memoized ModalItem component
- App.tsx wrapped with ErrorBoundary
- Improved component structure for better maintainability
- Enhanced edge case handling in financial utilities

### Fixed

- ESLint configuration compliance
- Label associations for form inputs
- Curly braces in conditional statements

## [1.0.0] - 2026-01-31

### Added

- Initial project setup with React 18 and TypeScript
- Vite build configuration
- Tailwind CSS styling
- Investment calculators (Mutual Fund, Stock Profit, Average Calculator)
- Gold vs Silver ratio tracker
- Stock, Mutual Fund, and Bond checklists
- React hooks learning modules
- Path aliases configuration
- Financial utilities with Decimal.js for precision
- Currency formatting utilities
- Logger utility for consistent logging
- Error boundary component
- Loading states component
- React Query integration
- Custom hooks (useForm, useChecklist)
- Navigation components with breadcrumbs
- Responsive design patterns
- Stock analysis with Zerodha integration

### Security

- HTML sanitization with DOMPurify
- Environment variable validation with Zod
- Safe number parsing for financial calculations
