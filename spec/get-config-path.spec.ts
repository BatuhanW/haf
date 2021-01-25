import os from 'os';

import { getConfigPath } from '../src/get-config-path';

const isWindows = os.platform() === 'win32';

const describeIfWindows = isWindows ? describe : describe.skip;

const describeIfUnix = isWindows ? describe.skip : describe;

const splitKey = isWindows ? '\\' : '/';

describe('get-config-path', () => {
  describe('extension', () => {
    describe('when absent', () => {
      it('should skip extension', () => {
        const path = getConfigPath('pop');

        const index = path.split(splitKey).lastIndexOf('pop');

        expect(index).toBeGreaterThanOrEqual(0);
      });
    });

    describe('when provided', () => {
      it('should append extension', () => {
        const path = getConfigPath('pop', 'dog');

        const index = path.split(splitKey).lastIndexOf('pop.dog');

        expect(index).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('platforms', () => {
    describeIfUnix('unix', () => {
      describe('when CONFIG_DIR is present', () => {
        beforeEach(() => {
          process.env.CONFIG_DIR = '/home/config_dir';
        });

        afterEach(() => {
          delete process.env.CONFIG_DIR;
        });

        it('should respect CONFIG_DIR', () => {
          const path = getConfigPath('pop');

          expect(path).toEqual('/home/config_dir/pop');
        });
      });

      describe('when XDG_CONFIG_HOME is present', () => {
        beforeEach(() => {
          process.env.XDG_CONFIG_HOME = '/home/xdg_config_home';
        });

        afterEach(() => {
          delete process.env.XDG_CONFIG_HOME;
        });

        it('should respect XDG_CONFIG_HOME', () => {
          const path = getConfigPath('pop');

          expect(path).toEqual('/home/xdg_config_home/pop');
        });
      });

      describe('when fallback', () => {
        const spy = jest.spyOn(os, 'homedir');

        beforeEach(() => {
          spy.mockReturnValue('/Users/anda');
        });

        afterEach(() => {
          spy.mockRestore();
        });

        it('should put under ~/.config', () => {
          const path = getConfigPath('pop');

          expect(path).toEqual('/Users/anda/.config/pop');
        });
      });
    });

    describeIfWindows('when windows 😞', () => {
      beforeEach(() => {
        process.env.LOCALAPPDATA = 'C:\\Users\\Pop\\ApplicationData';
      });

      afterEach(() => {
        delete process.env.LOCALAPPDATA;
      });

      it('should deal with WINDOWS', () => {
        const path = getConfigPath('pop');

        expect(path).toEqual('C:\\Users\\Pop\\ApplicationData\\pop');
      });
    });
  });
});
