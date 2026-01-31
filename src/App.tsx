import './App.css';
import Routing from '@pages/route/Routing';
import { ToastContainer, ErrorBoundary } from '@components/common';

function App() {
  return (
    <ErrorBoundary>
      <ToastContainer />
      <Routing></Routing>
    </ErrorBoundary>
  );
}

export default App;
