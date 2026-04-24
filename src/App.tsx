import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import AppRouter from './components/layout/AppRouter';

export default function App() {
  return (
    <UserPreferencesProvider>
      <AppRouter />
    </UserPreferencesProvider>
  );
}
