import RealtorShell from "@/components/realtor-shell";

export default function RealtorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RealtorShell>{children}</RealtorShell>;
}
