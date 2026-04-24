import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import AppRouter from './components/layout/AppRouter';
import SEOHead from './components/seo/SEOHead';

export default function App() {
  return (
    <>
      <SEOHead />
      <UserPreferencesProvider>
        <AppRouter />
      </UserPreferencesProvider>
    </>
  );
}
