import AuthGuard from "@/components/auth/auth-guard";

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
