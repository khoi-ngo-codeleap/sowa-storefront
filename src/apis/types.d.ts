interface MenuItem {
    name: string;
    url: string;
    children?: MenuItem[];
  }
  
  interface Tab {
    context: string;
    name: string;
    url: string;
    feature: string[];
  }
  
  interface Manifesto {
    manifestVersion: string;
    version: string;
    name: {
      short: string;
      full: string;
    };
    description: {
      short: string;
      full: string;
    };
    icon: {
      light: string;
      dark: string;
    };
    communication: {
      supportUrl: string;
      guideUrl: string;
    };
    legal: {
      gdprRequestUrl: string;
      gdprDeleteUrl: string;
      privacyUrl: string;
      termsOfUseUrl: string;
    };
    lifecycle: {
      connectUrl: string;
      disconnectUrl: string;
    };
    requirements: {
      minCloudApiVersion: string;
    };
    capabilities: {
      hub: {
        appLauncher: {
          redirectUrl: string;
        };
      };
      wawi: {
        headless: {
          url: string;
        };
        menuItems: MenuItem[];
        tabs: Tab[];
        api: {
          scoped: string[];
        };
        inline: Record<string, unknown>;
      };
    };
  }