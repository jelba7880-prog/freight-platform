import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@freight/ui";

import { auth, signOut } from "@/auth";

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <AppShell
      brand="Freight Platform Admin"
      navItems={[
        { label: "Shipments", href: "/shipments" },
        { label: "Customers", href: "/customers" },
      ]}
      userEmail={session.user.email ?? ""}
      signOutAction={async () => {
        "use server";
        await signOut();
      }}
    >
      {children}
    </AppShell>
  );
}
