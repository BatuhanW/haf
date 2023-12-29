import path from 'path';
import os from 'os';

export const getStorePath = (name: string, extension = 'haf'): string => {
  const fileName = `${name}.${extension}`;

  const storeDir =
    process.env['CONFIG_DIR'] ||
    process.env['XDG_CONFIG_HOME'] ||
    (os.platform() === 'win32' && process.env['LOCALAPPDATA']) ||
    path.join(os.homedir(), '.config');

  return path.join(storeDir, fileName);
};
