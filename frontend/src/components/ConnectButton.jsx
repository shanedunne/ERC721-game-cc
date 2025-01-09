import { useAppKit } from "@reown/appkit/react";

const ConnectButton = () => {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <appkit-button />
  );
};

export default ConnectButton;
