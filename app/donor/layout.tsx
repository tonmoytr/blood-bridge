import AuthGuard from "@/components/auth/auth-guard";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
