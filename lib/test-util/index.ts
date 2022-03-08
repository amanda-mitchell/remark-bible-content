import 'dotenv/config';

export function getExpectedEnvironmentVariable(name: string) {
  return (
    process.env[name] ||
    throwException(`The ${name} environment variable should be defined.`)
  );
}

function throwException(message?: string): never {
  throw new Error(message);
}
