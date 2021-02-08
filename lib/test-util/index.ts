import { config as initializeEnvironment } from 'dotenv';

export function getExpectedEnvironmentVariable(name: string) {
  ensureEnvironmentInitialized();

  return (
    process.env[name] ||
    throwException(`The ${name} environment variable should be defined.`)
  );
}

let initialized = false;
function ensureEnvironmentInitialized() {
  if (!initialized) {
    initializeEnvironment();
    initialized = true;
  }
}

function throwException(message?: string): never {
  throw new Error(message);
}
