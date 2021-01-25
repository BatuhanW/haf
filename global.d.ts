declare namespace NodeJS {
  interface ProcessEnv {
    CONFIG_DIR?: string;
    XDG_CONFIG_HOME?: string;
    LOCALAPPDATA?: string;
  }
}
