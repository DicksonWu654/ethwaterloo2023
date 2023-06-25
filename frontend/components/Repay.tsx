import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useETHBalance from "../utils/useETHBalance";
import { parseBalance } from "../util";
import { Button, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import abi from "../contracts/ERC20.json"
import getContract from "../utils/getContract";
import { BigNumber, Contract } from "ethers";


const Repay = ({onOpen, setContents, contract, index}) => {
  const { library, account } = useWeb3React<Web3Provider>();

  return (
    <Button
        colorScheme="teal"
        style={{padding: 10}}
        onClick={async () => {
        try {
            setContents({
                title: "Repay",
                body:
                    <VStack 
                        padding={'30px'}
                    >
                        <Button
                            colorScheme="teal"
                            onClick={async () => {
                                try {
                                    const loan = await contract?.loans(index);
                                    console.log(loan)
                                    const asset = new Contract(loan.asset_address, abi, library.getSigner(account));
                                    await asset.approve(contract.address, BigNumber.from("1000000000000000000000000000000000000000000000000000000000000"))
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                        >
                            Approve
                        </Button>
                        <Button
                            colorScheme="teal"
                            onClick={async () => {
                                try {
                                    const tx = await contract?.repay(index);
                                    console.log(tx)
                                } catch (e) {
                                    console.log(e)
                                }
                            }}
                        >
                            Repay
                        </Button>
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
        Repay
    </Button>
    )
};

export default Repay;
