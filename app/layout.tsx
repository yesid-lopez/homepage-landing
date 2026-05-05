import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yesid's Platform Lab",
  description:
    "A security-conscious overview of Yesid Lopez's private Kubernetes platform lab, covering GitOps, applications, storage, observability, and platform practices without exposing sensitive operational details.",
};

const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "6d354ddf-de7c-40a2-87ed-d426fd5d9143";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {umamiScriptUrl ? (
          <Script
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
