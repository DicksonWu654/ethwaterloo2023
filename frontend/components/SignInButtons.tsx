import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { IDKitWidget, SignInButton } from '@worldcoin/idkit'
import Image from "next/image";
import { SismoConnectButton, AuthType,  SismoConnectConfig, SismoConnectResponse } from "@sismo-core/sismo-connect-react";

const config: SismoConnectConfig = {
  appId: "0x0b9bf2b85b994cc6e2878527f8bc73ac", 
}

const SignInButtons = ({ changeVisibility }) => {
  const { account } = useWeb3React<Web3Provider>();
  const { data } = useETHBalance(account);

  return (
    <div style={{flexDirection: 'row', display: 'flex', minWidth: '400px', height: '100%', justifyContent: 'space-around', alignItems: 'center', gap: '10px'}}>
        <IDKitWidget
          action="my_signal"
          onSuccess={result => changeVisibility(true)}
          app_id="app_369183bd38f1641b6964ab51d7a20434 " // obtain this from developer.worldcoin.org
        >
          {({ open }) => <SignInButton onClick={open}/>}
        </IDKitWidget>
    
        <div style={{flexDirection: 'column', display: 'flex', }}>
            <Image
                src="/qrcode.png"
                alt="Worldcoin"
                width={200}
                height={200}
            />
            <button style={{borderRadius: 10, borderWidth: 0, padding: 10, marginBlock: 10}} onClick={() => changeVisibility(true)}>Next</button>
        </div>
        
        <SismoConnectButton 
            // the client config created
            config={config}
            // request a proof of account ownership 
            // (here Vault ownership)
            auth={{authType: AuthType.VAULT}}
            // request a proof of group membership 
            // // (here the group with id 0x42c768bb8ae79e4c5c05d3b51a4ec74a)
            // claim={{
            //     // groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a"
            // }}
            // request a message signature
            signature={{message: "KYC For Friend.Fi"}}
            //  a response containing his proofs 
            onResponse={async (response: SismoConnectResponse) => {
                console.log(response)
                changeVisibility(true)
                //Send the response to your server to verify it
                //thanks to the @sismo-core/sismo-connect-server package
            }}
            onResponseBytes={async (bytes: string) => {
                //Send the response to your contract to verify it
                //thanks to the @sismo-core/sismo-connect-solidity package
            }}
        />
    </div>
  );
};

export default SignInButtons;
