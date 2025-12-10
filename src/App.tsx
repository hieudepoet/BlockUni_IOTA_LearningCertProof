import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IotaClientProvider, WalletProvider, createNetworkConfig } from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
import '@iota/dapp-kit/dist/index.css';
import './index.css';

import { LearningProvider } from './context/LearningContext';
import { Header } from './components/Header';
import { CourseExplorer } from './pages/CourseExplorer';
import { CourseLearning } from './pages/CourseLearning';
import { MyCertificates } from './pages/MyCertificates';

// Network configuration for IOTA testnet
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <LearningProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<CourseExplorer />} />
                <Route path="/course/:courseId" element={<CourseLearning />} />
                <Route path="/certificates" element={<MyCertificates />} />
              </Routes>
            </BrowserRouter>
          </LearningProvider>
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

export default App;
