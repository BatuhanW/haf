import path from 'path';
import os from 'os';

const getDefaultDir = () =>
  process.env['CONFIG_DIR'] ||
  process.env['XDG_CONFIG_HOME'] ||
  (os.platform() === 'win32' && process.env['LOCALAPPDATA']) ||
  path.join(os.homedir(), '.config');

export const getStorePath = (
  name: string,
  extension = 'haf',
  storeDir = getDefaultDir(),
): string => {
  const fileName = `${name}.${extension}`;

  return path.join(storeDir, fileName);
};
