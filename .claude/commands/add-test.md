Generate a Jest test file for the given source file in this project.

Target file: $ARGUMENTS

Steps:
1. Read the target file and identify all exported functions/components
2. Read 2-3 existing test files in __tests__/ to understand the project's test style
   (imports, describe/it naming, assertion patterns, mock setup)
3. Generate a test file at the matching path under __tests__/
   e.g. lib/foo.ts → __tests__/lib/foo.test.ts
   e.g. components/ui/Bar.tsx → __tests__/components/ui/Bar.test.tsx
4. Cover for each export:
   - Happy path (normal input → expected output)
   - Edge cases: null/undefined inputs, empty strings, empty arrays, boundary values
   - Error cases: invalid input that should throw or return error state
5. For React components: use @testing-library/react, test render + user interaction
6. For pure functions: test return values directly, no mocks unless truly necessary
7. Run `npm test -- --testPathPattern=<new-test-file>` to verify all tests pass
8. If any test fails, fix it before finishing

Follow TypeScript strict mode. No `any`. Match the describe/it naming style of existing tests exactly.
