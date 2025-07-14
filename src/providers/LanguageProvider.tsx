import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IntlProvider, ResolvedIntlConfig } from "react-intl";

type SupportedLocale = "en" | "es-MX";
type MessageId = keyof Awaited<typeof import("@/lang/en.json")>;
declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: MessageId;
    }
    interface IntlConfig {
      locale: SupportedLocale;
    }
  }
}

type LanguageContextValue = {
  changeLocale: (locale: SupportedLocale) => void;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

// provider setting
let initLocale: SupportedLocale = "en";
switch (navigator.language) {
  case "es":
    initLocale = "es-MX";
    break;
}
const loadMessages = (locale: string) => {
  switch (locale) {
    case "es-MX":
      return import("@/lang/es.json");
    case "en":
    default:
      return import("@/lang/en.json");
  }
};

export const LanguageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState<SupportedLocale>(initLocale);
  const [messages, setMessages] = useState<
    ResolvedIntlConfig["messages"] | undefined
  >(undefined);

  useEffect(() => {
    loadMessages(locale).then((data) => setMessages(data.default));
  }, [locale]);

  const languageContextValue = useMemo(
    () => ({
      changeLocale: (locale: SupportedLocale) => {
        setLocale(locale);
      },
    }),
    [],
  );

  return (
    <IntlProvider locale={initLocale} messages={messages}>
      <LanguageContext.Provider value={languageContextValue}>
        {children}
      </LanguageContext.Provider>
    </IntlProvider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
