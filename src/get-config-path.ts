import path from 'path';
import os from 'os';

export const getConfigPath = (name: string, extension?: string): string => {
  if (extension) {
    name += `.${extension}`;
  }

  const confDir =
    process.env['CONFIG_DIR'] ||
    process.env['XDG_CONFIG_HOME'] ||
    (os.platform() === 'win32' && process.env['LOCALAPPDATA']) ||
    path.join(os.homedir(), '.config');

  return path.join(confDir, name);
};
