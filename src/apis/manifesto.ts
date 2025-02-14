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

export const fetchManifesto = async (): Promise<Manifesto> => {
  const manifesto: Manifesto = {
    manifestVersion: "1.0.0",
    version: "1.0.0",
    name: {
      short: "Demo Plugin",
      full: "The official plugin for Demo",
    },
    description: {
      short: "Lorem ipsum.",
      full: "Minions ipsum gelatooo uuuhhh para tú bappleees para tú tank yuuu! Gelatooo po kass. Bappleees poopayee tulaliloo pepete belloo! Wiiiii.",
    },
    icon: {
      light: "https://demogmbh.com/assets/logo-light.svg",
      dark: "https://demogmbh.com/assets/logo-dark.svg",
    },
    communication: {
      supportUrl: "https://demogmbh.com/support-for-plugin-xy",
      guideUrl: "https://demogmbh.com/guide-for-plugin-xy",
    },
    legal: {
      gdprRequestUrl: "https://demogmbh.com/gdpr/request",
      gdprDeleteUrl: "https://demogmbh.com/gdpr/delete",
      privacyUrl: "https://demogmbh.com/privacy",
      termsOfUseUrl: "https://demogmbh.com/terms-of-use",
    },
    lifecycle: {
      connectUrl: "https://jtl.integrations.demogmbh.com/lifecycle/connect",
      disconnectUrl:
        "https://jtl.integrations.demogmbh.com/lifecycle/disconnect",
    },
    requirements: {
      minCloudApiVersion: "version12",
    },
    capabilities: {
      hub: {
        appLauncher: {
          redirectUrl: "https://app.demogmbh.com/?login-provider=jtl",
        },
      },
      wawi: {
        headless: {
          url: "https://jtl.integrations.demogmbh.com/wawi/headless",
        },
        menuItems: [
          {
            name: "Demo GmbH Overview",
            url: "https://jtl.integrations.demogmbh.com/wawi/pages/home",
          },
          {
            name: "Demo GmbH Features",
            url: "https://jtl.integrations.demogmbh.com/wawi/pages/features",
            children: [
              {
                name: "AI",
                url: "https://jtl.integrations.demogmbh.com/wawi/pages/features/ai",
                children: [
                  {
                    name: "Image generation",
                    url: "https://jtl.integrations.demogmbh.com/wawi/pages/features/ai/image",
                  },
                  {
                    name: "Text generation",
                    url: "https://jtl.integrations.demogmbh.com/wawi/pages/features/ai/text",
                  },
                ],
              },
            ],
          },
        ],
        tabs: [
          {
            context: "productDetail",
            name: "Demo data",
            url: "https://jtl.integrations.demogmbh.com/wawi/tabs/product/detail",
            feature: ["details:full", "pricing:write"],
          },
          {
            context: "customerDetail",
            name: "Demo data",
            url: "https://jtl.integrations.demogmbh.com/wawi/tabs/customer/detail",
            feature: ["details:write", "address:read"],
          },
        ],
        api: {
          scoped: ["productRead", "productDelete"],
        },
        inline: {},
      },
    },
  };
  return new Promise((resolve) => setTimeout(() => resolve(manifesto), 1000));
};
