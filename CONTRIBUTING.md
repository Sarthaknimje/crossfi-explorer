# Contributing to CrossFi API Quickstart

Thank you for your interest in contributing to the CrossFi API Quickstart project! This document provides guidelines and instructions for contributing to this repository.

## Code of Conduct

By participating in this project, you agree to abide by the CrossFi Code of Conduct (to be defined).

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by creating an issue. Before creating an issue, please check if the bug has already been reported. When creating an issue, provide the following information:

1. A clear and descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (browser, OS, etc.)

### Suggesting Enhancements

If you have an idea for enhancing the project, please create an issue with the following information:

1. A clear and descriptive title
2. A detailed description of the enhancement
3. The benefits of implementing the enhancement
4. Any potential drawbacks or challenges

### Pull Requests

1. Fork the repository
2. Create a branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes (if applicable)
5. Run existing tests to ensure your changes don't break existing functionality
6. Submit a pull request

#### Pull Request Guidelines

1. Keep your pull request focused on a single topic
2. Follow the coding style and conventions used in the project
3. Write clear commit messages
4. Include tests for new features or bug fixes
5. Update documentation if necessary

## Development Setup

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/crossfi-api-quickstart.git
   cd crossfi-api-quickstart
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your Alchemy API key:
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Run tests:
   ```
   npm test
   ```

## Coding Style

- Follow the ESLint and TypeScript configuration provided in the project
- Use descriptive variable and function names
- Write comments for complex logic
- Maintain the existing code structure and organization

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [ISC License](LICENSE).

## Questions?

If you have any questions about contributing, please open an issue or contact the project maintainers. 