const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-dotted-pattern bg-cover bg-fixed bg-center">
      <div>{children}</div>
    </div>
  );
};

export default Layout;
