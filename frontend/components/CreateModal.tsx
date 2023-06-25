import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";


const CreateModal = ({onOpen, setContents, contract, loans, setLoans}) => {
  const { account } = useWeb3React<Web3Provider>();
  const { data } = useETHBalance(account);

  return (
    <Button
        colorScheme="teal"
        style={{padding: 10}}
        onClick={async () => {
        try {
            setContents({
                title: "Create New Loan",
                body:(() => {
                    let score, time, asset, amount;
                    return(
                    <VStack 
                        padding={'30px'}
                    >
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'5px'}
                        >
                            <Text>Stake Score</Text>
                            <Input style={{maxWidth: '150px'}} placeholder="Score" 
                                onChange={(e) => {
                                    score = parseInt(e.target.value)
                                }}
                            />
                        </HStack>
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'5px'}
                        >
                            <Text>Time To Expire</Text>
                            <Input style={{maxWidth: '150px'}} placeholder="Time"
                                onChange={(e) => {
                                    time = parseInt(e.target.value)
                                }}
                            />
                        </HStack>
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'5px'}
                        >
                            <Text>Asset</Text>
                            <Input style={{maxWidth: '150px'}} placeholder="Address"
                                onChange={(e) => {
                                    asset = e.target.value
                                }}
                            />
                        </HStack>
                        <HStack
                            w={'full'}
                            justifyContent={'space-between'}
                            border={'0px solid black'}
                            padding={'5px'}
                        >
                            <Text>Amount Owed</Text>
                            <Input style={{maxWidth: '150px'}} placeholder="Amount"
                                onChange={(e) => {
                                    amount = parseInt(e.target.value)
                                }}
                            />
                        </HStack>
                        <Button
                            colorScheme="teal"
                            onClick={async () => {
                                try {
                                    const tx = await contract?.create_loan(score, time, time, asset, amount)
                                    console.log(tx)
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                        >
                            Create Loan
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
        Create New Loan
    </Button>
  )
};

export default CreateModal;
