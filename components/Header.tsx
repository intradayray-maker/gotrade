import HeaderClient from "./HeaderClient";
import type { User } from "@supabase/supabase-js";

type HeaderProps = {
  user: User | null;
  isAdmin: boolean;
  variant: "public" | "dashboard";
  homeHref: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Header(props: HeaderProps) {
  return <HeaderClient {...props} />;
}
