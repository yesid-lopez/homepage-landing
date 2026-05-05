import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yesid's Platform Lab",
  description:
    "A security-conscious overview of Yesid Lopez's private Kubernetes platform lab, covering GitOps, applications, storage, observability, and platform practices without exposing sensitive operational details.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
