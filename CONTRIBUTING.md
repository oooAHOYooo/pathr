# Contributing to Pathr

Thank you for your interest in contributing to Pathr! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/pathr.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running Locally

```bash
# Start mobile app
pnpm dev

# Start web dashboard (in another terminal)
pnpm dev:web

# Run all apps
pnpm dev:all
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (Prettier + ESLint)
- Run `pnpm format` before committing
- Ensure `pnpm lint` and `pnpm typecheck` pass

### Testing

- Write tests for new utilities and components
- Run `pnpm test` before submitting PR
- Aim for 80% coverage on utils, 60% on components

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add trip recording functionality`
- `fix: resolve GPS accuracy issue`
- `docs: update README with setup instructions`

## Pull Request Process

1. Ensure all tests pass and linting is clean
2. Update documentation if needed
3. Create a descriptive PR with:
   - What changed and why
   - Screenshots (for UI changes)
   - Testing instructions
4. Request review from maintainers

## Issue Reporting

Use the issue templates:
- 🐛 Bug report
- ✨ Feature request
- ❓ Question

Include:
- Clear description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (OS, device, etc.)

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great together.


