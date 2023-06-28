import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'html', 'cobertura'],
      src: ['./src'],
      reportsDirectory: './tests/reports/coverage',
      clean: true,
      cleanOnRerun: true
    },
    reporters: [
      'default',
      'junit'
    ],
    dir: './tests',
    clearMocks: true,
    mockReset: true,
    outputFile: {
      'junit': './tests/reports/result/junit.xml'
    }
  }
});
