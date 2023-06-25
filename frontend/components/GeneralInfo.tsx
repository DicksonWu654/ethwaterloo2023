import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import Attest from "./Attest";
import Repay from "./Repay";
import Settle from "./Settle";
import Loan from "./Loan";


const GeneralInfo = ({onOpen, setContents, contract, index}) => {

  return (
    <Button
        colorScheme="teal"
        style={{padding: 10}}
        onClick={async () => {
        try {
            setContents({
                title: "General Information",
                body:
                    <VStack 
                        padding={'30px'}
                        textAlign={'left'}
                    >
                        <HStack

                            w={'full'}
                            justifyContent={'center'}
                            border={'0px solid black'}
                            paddingTop={'10px'}
                        >
                            <Attest onOpen={onOpen} setContents={setContents} contract={contract} index={index}/>
                            <Loan onOpen={onOpen} setContents={setContents} contract={contract} index={index}/>
                        </HStack>
                        <HStack
                            w={'full'}
                            justifyContent={'center'}
                            border={'0px solid black'}
                        >
                            <Repay onOpen={onOpen} setContents={setContents} contract={contract} index={index}/>
                            <Settle onOpen={onOpen} setContents={setContents} contract={contract} index={index}/>
                        </HStack>

                    </VStack>
                
            })
            onOpen()
            // const tx = await contract?.create_loan(1000, 1000, 1000, 1000, 1000, 1000, 1000)
            // console.log(tx)
        } catch (e) {
            console.log(e)
        }
    }}
    >
        View
    </Button>
    )
};

export default GeneralInfo;
