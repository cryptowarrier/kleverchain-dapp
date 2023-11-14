import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from '../components/Layout';
import Staking from '../pages/Staking';
import Wallet from '../pages/Wallet';
import ConnectWallet from 'pages/ConnectWallet';
import PrivateRoutes from 'components/PrivateRoutes';
import Delegate from 'pages/Staking/Delegate';
import Freeze from '../pages/Staking/Freeze';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/connect" component={ConnectWallet} />
        <Layout>
          <PrivateRoutes>
            <Route exact path="/staking" component={Staking} />
            <Route exact path="/staking/freeze" component={Freeze} />
            <Route exact path="/staking/claim/:id" component={Delegate} />
            <Route exact path="/wallet" component={Wallet} />
          </PrivateRoutes>
        </Layout>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
