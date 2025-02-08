import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth');
  const isDashboardPage = router.pathname.startsWith('/dashboard');
  
  // Don't wrap auth pages or dashboard pages with MainLayout
  if (isAuthPage || isDashboardPage) {
    return <Component {...pageProps} />;
  }

  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
};

export default App; 