interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <div className="app__sidebar">
      <form className="sidebar__form" onSubmit={(e) => e.preventDefault()}>
        {children}
      </form>
    </div>
  );
}
