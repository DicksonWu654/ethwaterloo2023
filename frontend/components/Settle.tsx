import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";


const Settle = ({onOpen, setContents, contract, index}) => {
  const { account } = useWeb3React<Web3Provider>();

  return (
    <Button
        colorScheme="teal"
        style={{padding: 10}}
        onClick={async () => {
        try {
            setContents({
                title: "Settle",
                body:(() => {
                    let attestorBurn, borrowerBurn;
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
                            <Text>Borrower Stake Burn</Text>
                            <Input style={{maxWidth: '150px'}} placeholder="Borrower Stake Burn" 
                                onChange={(e) => {
                                    borrowerBurn = parseFloat(e.target.value)
                                }}
                            />
                        </HStack>
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'10px'}
                        >
                            <Text>Attestor Stake Burn</Text>
                            <Input style={{maxWidth: '150px',}} placeholder="Attestor Stake Burn"
                           onChange={(e) => {
                                    attestorBurn = parseFloat(e.target.value)
                                }}     
                            />
                        </HStack>
                        <Button
                            colorScheme="teal"
                            onClick={async () => {
                                try {
                                    const tx = await contract?.settle(index, borrowerBurn, attestorBurn)
                                    console.log(tx)
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                        >
                            Settle
                        </Button>
                    </VStack>
                )})()
                
            })
            onOpen()
            // const tx = await contract?.create_loan(1000, 1000, 1000, 1000, 1000, 1000, 1000)
            // console.log(tx)
        } catch (e) {
            console.log(e)
        }
    }}
    >
        Settle
    </Button>
    )
};

export default Settle;
