import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../utils/useEagerConnect";
import SignInButtons from "../components/SignInButtons";
import { useEffect, useState } from "react";
import useContract from "../utils/getContract";
import FriendFiABI from "../contracts/FriendFi.json";
import getContract from "../utils/getContract";
import { Button, HStack, Heading, Input, Modal, Td, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Text, Th, Thead, Tr, VStack, useDisclosure } from "@chakra-ui/react";
import CreateModal from "../components/CreateModal";
import GeneralInfo from "../components/GeneralInfo";

const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

function FriendFi() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  const contracts = [
    { address: "0x0CE00904629C7e8D5D871885fc9684F451e8613C", chainId: 1442 },
    { address: "0x683Ec937602f602613078B8371df886d47E00EC3", chainId: 59140 },
    { address: "0xbC9a9e84393AfF7e6f6B28fB1740859d3C30c95B", chainId: 10200 },
    { address: "0x6E107e7b84D073C5E3B9d397F32cCB7Ef579E03E", chainId: 51 },
  ]

  const contract = getContract((contracts.find(contract => contract.chainId === chainId))?.address, FriendFiABI)

  const [loans, setLoans] = useState<any[]>();

  const [contents, setContents] = useState<any>({});

  useEffect(() => {
    try {
      (async () => {
        setLoans([(await contract?.loans(0))])
      })()
      contract &&
        contract.scores(account).then((score) => {
          score.toString() === '0' && contract.initialize_user()
        })
    } catch (e) {
      console.log(e)
    }
  }, [contract])

  const { isOpen, onOpen, onClose } = useDisclosure()

  const style = {
    border: '1px solid black',
    'borderCollapse': 'collapse',
    'padding': '10px'
  }

  return (
    <>
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

      <main style={{ marginTop: '100px' }}>
        <Heading>
          Loans
        </Heading>

        <div style={{ display: 'flex', textAlign: 'left', width: '100vw', justifyContent: 'center', marginBlock: '40px' }}>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th style={style}>Borrower</Th>
                  <Th style={style}>Expiration Date</Th>
                  <Th style={style}>Time To Payback</Th>
                  <Th style={style}>Loan Termination Date</Th>
                  <Th style={style}>Settled</Th>
                  <Th style={style}>Started</Th>
                  <Th style={style}>Asset Address</Th>
                  <Th style={style}>amount Owed</Th>
                  <Th style={style}>lender</Th>
                  <Th style={style}>score Staked Og</Th>
                  <Th style={style}>More Info</Th>
                </Tr>
              </Thead>
              <tbody>
                {
                  loans && loans?.map((loan, index) => {
                    return loan ? (
                      <Tr key={index} >
                        <Td style={style}>{loan[0].toString().substring(0, 6) + "..." + loan[0].toString().substring(loan[0].toString().length - 6, loan[0].toString().length)}</Td>
                        <Td style={style}>{(new Date(1687688376000)).toDateString()}</Td>
                        <Td style={style}>{(new Date(1688798376000)).toDateString()}</Td>
                        <Td style={style}>{loan[3].toString()}</Td>
                        <Td style={style}>{loan[4].toString()}</Td>
                        <Td style={style}>{loan[5].toString()}</Td>
                        <Td style={style}>{loan[6].toString().substring(0, 6) + "..." + loan[6].toString().substring(loan[6].toString().length - 6, loan[6].toString().length)}</Td>
                        <Td style={style}>{loan[7].toString()}</Td>
                        <Td style={style}>{loan[8].toString().substring(0, 6) + "..." + loan[8].toString().substring(loan[8].toString().length - 6, loan[8].toString().length)}</Td>
                        <Td style={style}>{loan[9].toString()}</Td>
                        <Td style={style}><GeneralInfo onOpen={onOpen} setContents={setContents} contract={contract} index={index} /></Td>
                      </Tr>
                    ) : null
                  })
                }
              </tbody>
            </Table>
          </TableContainer>
        </div>

        <CreateModal onOpen={onOpen} setContents={setContents} contract={contract} loans={loans} setLoans={setLoans} />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{contents.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {contents.body}
            </ModalBody>
          </ModalContent>
        </Modal>


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
    </>
  );
}

export default FriendFi;
