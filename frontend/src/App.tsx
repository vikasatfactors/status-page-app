import React from 'react';
import AppRoutes from './AppRoutes';
import AppLayout from './components/layout/AppLayout';
import { AuthContextProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-background'>
      <AppLayout>
        <AuthContextProvider>
          <Provider store={store}>
            <AppRoutes />
          </Provider>
        </AuthContextProvider>
      </AppLayout>
    </div>
  );
};

export default App;
