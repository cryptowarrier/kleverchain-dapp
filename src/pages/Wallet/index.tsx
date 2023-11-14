import { toast } from 'react-toastify';
import Header from 'components/Pages/Header';
import Balance from 'components/Wallet/Balance';
import { Container, Title } from 'pages/styles';
import React, { useEffect, useState } from 'react';
import api from 'services/api';
import { useSdk } from '../../hooks';
import { WalletHeader, FaucetIcon } from './styles';
import { getNetwork } from 'utils';

const Wallet: React.FC = () => {
  const [reload, setReload] = useState(false);
  const sdk = useSdk();
  const reloadFunc = () => {
    setReload(true);
  };

  useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload]);

  const headerProps = {
    border: 'none',
    reload: reloadFunc,
  };

  const handleRequestKLV = async () => {
    setReload(true);

    const response = await api.post({
      route: `transaction/send-user-funds/${sdk.getAccount()?.getAddress()}`,
    });

    if (response.code === 'internal_error') {
      toast.error('You already ordered KLV in less than 24 hours!');
      return;
    } else {
      toast.success('Test KLV request successful!');

      setTimeout(() => {
        reloadFunc();
      }, 3000);
    }
  };

  return (
    <Container>
      <WalletHeader>
        <Header {...headerProps}>
          <Title>Wallet</Title>
        </Header>
        {!reload && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Balance />
            {getNetwork() !== 'Mainnet' && (
              <FaucetIcon
                size={23}
                title="Request daily KLV"
                onClick={() => handleRequestKLV()}
              />
            )}
          </div>
        )}
      </WalletHeader>
    </Container>
  );
};

export default Wallet;
