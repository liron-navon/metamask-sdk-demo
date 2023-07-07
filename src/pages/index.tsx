import { MetaMaskSDK } from "@metamask/sdk";
import { BrowserProvider } from "ethers";
import { useMountedState, useEffectOnce } from "react-use";
import { useState } from "react";

const messageToSign = "hello world!";

export default function Home() {
  const isMounted = useMountedState();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signature, setSignature] = useState<string>();
  const [account, setAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const m = () => typeof window !== "undefined" && isMounted();

  const connectAndSign = async () => {
    try {
      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "hello my app",
          url: window.location.host,
        },
      });

      const ethereum = MMSDK.getProvider();

      const p = new BrowserProvider(ethereum!);
      setProvider(p);

      const accounts = await p.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = await p!.getSigner();
      const sig = await signer.signMessage(messageToSign);

      setSignature(sig);
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
    }
  };

  return (
    <main className="p-24">
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => connectAndSign()}
        >
          Connect metamask and sign
        </button>
      </div>
      {m() && (
        <>
          {errorMessage && <div className="mt-12">error: {errorMessage}</div>}
        </>
      )}
      {m() && (
        <>
          {signature && (
            <div className="mt-12">signed message: {signature}</div>
          )}
        </>
      )}
      {m() && (
        <>
          {account && (
            <div className="mt-12">connected as account: {account}</div>
          )}
        </>
      )}
    </main>
  );
}
