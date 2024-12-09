import React from 'react';
import AppRoutes from './AppRoutes';
import AppLayout from './components/layout/AppLayout';
import { AuthContextProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import store from './store';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ErrorBoundary from './components/common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-background'>
      <ErrorBoundary>
        <AuthContextProvider>
          <WebSocketProvider>
            <Provider store={store}>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </Provider>
          </WebSocketProvider>
        </AuthContextProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
