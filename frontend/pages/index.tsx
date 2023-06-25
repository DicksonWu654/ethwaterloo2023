import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../utils/useEagerConnect";
import SignInButtons from "../components/SignInButtons";
import { useEffect, useState } from "react";

const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    visible && (window.location.href = "/app");
  }, [visible])

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>Friend.Fi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">Friend.Fi</Link>
          {isConnected && (
            <ETHBalance />
          )}
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <h1 style={{marginBottom: '10rem'}}>
          Sign in to Friend.Fi
        </h1>
        {isConnected && (
          <SignInButtons changeVisibility={setVisible}/>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
