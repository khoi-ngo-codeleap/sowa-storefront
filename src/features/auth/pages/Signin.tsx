import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { inputVariants } from "@/components/ui/input";
import { labelVariants } from "@/components/ui/label";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "@/api/client/supabase";
import { useNavigate, useSearch } from "@tanstack/react-router";

import imgUrl from "/pencil.webp";
import { useEffect } from "react";

const Signin = () => {
  const { redirect } = useSearch({ from: "/signin" });
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.info("auth state change:: hasSession", !!session);
      if (session) {
        await supabase.realtime.setAuth();
        navigate({ to: redirect ?? "/" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <main className="bg-[#fef4de69] min-h-svh flex flex-col items-center justify-center p-6 md:p-10">
      <div className={cn("flex flex-col gap-6", "w-[768px] max-w-full")}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className=" text-muted-foreground text-balance">
                  Login to your Sowa account
                </p>
              </div>
              {/* <pre>{redirect}</pre> */}
              <div>
                <Auth
                  // redirectTo={"http://localhost:3100/customers"}
                  view="sign_in"
                  supabaseClient={supabase}
                  socialLayout="horizontal"
                  providers={["github", "google", "discord"]}
                  appearance={{
                    theme: {
                      default: {
                        colors: {
                          brand: "var(--primary)",
                          brandAccent:
                            "color-mix(in oklab, var(--primary) 90%, transparent)",
                          brandButtonText: "var(--primary-foreground)",
                          //     defaultButtonBackground: string,
                          defaultButtonBackgroundHover: "var(--accent)",
                          defaultButtonBorder: "var(--border)",
                          //     defaultButtonText: string,
                          dividerBackground: "var(--border)",
                          //     inputBackground: string,
                          inputBorder: "var(--input)",
                          inputBorderFocus: "var(--ring)",
                          inputBorderHover: "var(--input)",
                          //     inputLabelText: string,
                          inputPlaceholder: "var(--muted-foreground)",
                          //     inputText: string,
                          //     messageText: string,
                          //     messageBackground: string,
                          //     messageBorder: string,
                          messageTextDanger: "var(--destructive)",
                          //     messageBackgroundDanger: string,
                          //     messageBorderDanger: string,
                          //     anchorTextColor: string,
                          //     anchorTextHoverColor: string,
                        },
                        space: {
                          // spaceSmall: "calc(var(--spacing) * 6)",
                          // spaceMedium: "calc(var(--spacing) * 6)",
                          // spaceLarge: "calc(var(--spacing) * 6)",
                          labelBottomMargin: "calc(var(--spacing) * 3)",
                          // anchorBottomMargin: "calc(var(--spacing) * 6)",
                          // emailInputSpacing: "calc(var(--spacing) * 6)",
                          // socialAuthSpacing: "calc(var(--spacing) * 6)",
                          buttonPadding:
                            "calc(var(--spacing) * 2) calc(var(--spacing) * 3)",
                          inputPadding:
                            "calc(var(--spacing) * 1) calc(var(--spacing) * 3)",
                        },
                        fontSizes: {
                          baseBodySize: "var(--text-sm)",
                          baseInputSize: "var(--text-sm)",
                          baseLabelSize: "var(--text-sm)",
                          baseButtonSize: "var(--text-sm)",
                        },
                        borderWidths: {
                          buttonBorderWidth: "1px",
                          inputBorderWidth: "1px",
                        },
                        radii: {
                          borderRadiusButton: "calc(var(--radius) - 2px)",
                          inputBorderRadius: "calc(var(--radius) - 2px)",
                        },
                      },
                    },
                    className: {
                      button: cn(buttonVariants()),
                      input: cn(inputVariants()),
                      label: cn(labelVariants()),
                      divider:
                        "mt-8! relative before:content-['Or_continue_with'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-background before:text-sm before:text-muted-foreground before:px-2 before:py-1 before:z-20 before:rounded-md",
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src={imgUrl}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground hover:[a]:*:text-primary text-center text-xs text-balance [a]:*:underline [a]:*:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </main>
  );
};

export default Signin;
