import '@testing-library/jest-dom'

// Note: Svelte lifecycle functions should not be mocked globally.
// They are imported from 'svelte' and should be properly handled by the test environment.
// If tests fail due to lifecycle issues, consider using @testing-library/svelte helpers
// or ensure proper component mounting in the test setup.