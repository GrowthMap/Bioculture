# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 15 app with TypeScript implementing a Typeform-like multi-step form system for retreat applications.

### Tech Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **React Hook Form** for form handling
- **Framer Motion** for animations

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/typeform/` - Reusable form components
- `src/store/form.store.ts` - Zustand store for form state
- `src/types/form.types.ts` - TypeScript types and form flow definitions

### Key Patterns

**State Management**: Uses Zustand for global form state with immutable updates. The store handles question navigation, answer storage, and form completion.

**Form Flow System**: Form questions are defined as flows in `form.types.ts`. The `APPLICATION_FLOWS` constant contains predefined question sequences with conditional routing support.

**Component Architecture**: 
- `TypeformContainer` - Main orchestrator component
- `FormQuestion` - Generic question wrapper with navigation
- Specialized question components (`MultipleChoiceQuestion`, `ContactMatrixQuestion`, etc.)

**Question Types**: Supports multiple question types including multiple choice, text inputs, contact matrix, and Calendly integration.

**Path Alias**: Uses `@/*` for `./src/*` imports as configured in `tsconfig.json`.

## Form Flow Configuration

Form flows are defined in `src/types/form.types.ts` with the `APPLICATION_FLOWS` array. Each flow contains:
- Questions with types, validation rules, and options
- Conditional routing capabilities
- Application-specific configurations (retreat dates, contact info, etc.)

The system is designed for multi-step forms with progress tracking and answer persistence across navigation.