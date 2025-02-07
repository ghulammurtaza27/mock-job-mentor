import { packageJson } from './package';
import { tsConfig } from './tsconfig';
import { appComponent } from './components/App';
import { indexHtml } from './public/index';
import { indexTs } from './src/index';
import { routesConfig } from './src/routes';
import { storeConfig } from './src/store';
import { apiConfig } from './src/api';
import { testSetup } from './test/setup';
import { dockerConfig } from './infrastructure/docker';
import { cicdConfig } from './infrastructure/cicd';
import { indexCss } from './src/index.css.ts';
import { Layout } from './src/components/Layout';
import { ThemeProvider } from './src/components/ThemeProvider';
import { Navbar } from './src/components/Navbar';
import { Footer } from './src/components/Footer';
import { tsConfigNode } from './tsconfig.node.json';

export const reactAdvancedTemplate = {
  // Core Files
  'package.json': packageJson,
  'tsconfig.json': tsConfig,
  'tsconfig.node.json': tsConfigNode,
  'docker-compose.yml': dockerConfig.compose,
  'Dockerfile': dockerConfig.dockerfile,
  '.github/workflows/ci.yml': cicdConfig.github,
  
  // Source Files
  'src/index.tsx': indexTs,
  'src/App.tsx': appComponent,
  'src/index.css': indexCss,
  'src/components/Layout.tsx': Layout,
  
  // Public Files
  'public/index.html': indexHtml,
  
  // Config Files
  'src/routes/index.ts': routesConfig.routes,
  'src/store/index.ts': storeConfig.store,
  'src/api/index.ts': apiConfig.setup,
  
  // Test Setup
  'src/test/setup.ts': testSetup,
  
  // Infrastructure
  'infrastructure/k8s/deployment.yml': dockerConfig.k8s.deployment,
  'infrastructure/k8s/service.yml': dockerConfig.k8s.service,
  'infrastructure/terraform/main.tf': dockerConfig.terraform,
  
  // New Components
  'src/components/ThemeProvider.tsx': ThemeProvider,
  'src/components/Navbar.tsx': Navbar,
  'src/components/Footer.tsx': Footer,
}; 