import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FormattedMessage } from "react-intl";

export const Route = createLazyFileRoute("/_protected/about")({
  component: About,
});

function About() {
  const { changeLocale } = useLanguage();
  return (
    <div className="p-2">
      <div className="text-2xl font-bold">
        <FormattedMessage id="app.greeting" defaultMessage="Hello" />
      </div>
      <div>
        <FormattedMessage
          id="app.footer"
          defaultMessage="This app about prepare project structure for JTL HUB"
        />
      </div>
      <div>
        <FormattedMessage
          id="app.footer"
          defaultMessage="This is footer for now"
        />
      </div>
      <div className="flex gap-x-2">
        <Button onClick={() => changeLocale("en")}>English</Button>
        <Button onClick={() => changeLocale("es-MX")}>Spain</Button>
      </div>
    </div>
  );
}
