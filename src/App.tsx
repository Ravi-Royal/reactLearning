import './App.css';
import Routing from '@pages/route/Routing';
import { ToastContainer } from '@components/common';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastContainer />
      <Routing></Routing>
    </ErrorBoundary>
  );
}

export default App;
