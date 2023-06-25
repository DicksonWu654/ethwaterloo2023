import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { BigNumber } from "ethers";


const Attest = ({onOpen, setContents, contract, index}) => {

    const { account, library, chainId } = useWeb3React();



    return (
    <Button
        colorScheme="teal"
        style={{padding: 10}}
        onClick={async () => {
        try {
            setContents({
                title: "Attest",
                body: (() => {
                    let amount;
                    return (
                    <VStack 
                        padding={'30px'}
                    >
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'10px'}
                        >
                            <Text>Attest Amount</Text>
                            <Input style={{maxWidth: '150px'}} value={amount}
                                onChange={(e) => 
                                    amount = parseInt(e.target.value)
                                }
                                placeholder="Amount"
                            />
                        </HStack>
                        <Button
                            disabled={!amount}
                            colorScheme="teal"
                            onClick={async () => {
                                console.log(index, amount)
                                // console.log(parseInt(index), BigNumber.from(amount.toString()) )
                                const tx = await contract?.attest(parseInt(index), BigNumber.from(amount.toString()))
                                console.log(tx)
                            }}
                        >
                            Attest
                        </Button>
                    </VStack>
                    )
                })()
                
            })
            onOpen()
            // const tx = await contract?.create_loan(1000, 1000, 1000, 1000, 1000, 1000, 1000)
            // console.log(tx)
        } catch (e) {
            console.log(e)
        }
    }}
    >
        Attest
    </Button>
    )
};

export default Attest;
