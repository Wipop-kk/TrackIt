import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Prevent static prerendering — this page always redirects based on auth state
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  if (user) {
    redirect("/protected");
  }

  redirect("/auth/login");
}
