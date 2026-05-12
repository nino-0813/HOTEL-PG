import AdminLayoutClient from '../AdminLayoutClient';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
