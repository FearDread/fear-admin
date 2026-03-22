import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './features/store';
import App from './App';
import { name as eFear } from './app.json';

function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

function Root() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

AppRegistry.registerComponent(eFear, () => Root);