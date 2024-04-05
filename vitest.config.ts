import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    coverage: {
      reporter: ['text', 'html', 'cobertura', 'json-summary', 'json'],
      include: ['src/'],
      reportsDirectory: './tests/reports/coverage',
      clean: true,
      cleanOnRerun: true,
      reportOnFailure: true,
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90
      }
    },
    reporters: ['default', 'junit'],
    dir: './tests',
    clearMocks: true,
    mockReset: true,
    outputFile: {
      junit: './tests/reports/result/junit.xml'
    }
  }
});
