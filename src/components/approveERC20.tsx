import React, { useState, useEffect } from 'react'
import {Button, Input , NumberInput,  NumberInputField, Select, FormControl,  FormLabel, Text } from '@chakra-ui/react'
import {ethers} from 'ethers'
import {abi} from '../../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json'
import { Contract } from "ethers"
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider"


interface Props {
   // addressContract: string,
    currentAccount: string | undefined ,
    ourAddress: string
}

declare let window: any;


export default function ApproveERC20(props:Props){
 // const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const ourAddress = props.ourAddress     // market address
  //var [user_id, setUserId] = useState(0)
  //var [user_name, setUserName] = useState<string>("")

  var [human_number,setHuman_number] = useState<string>("")
  var [addressContract, setAddressContract] = useState<string>("")


  useEffect(() => {
    

  }, []);
  

  async function approveERC20(event:React.FormEvent) {
    event.preventDefault()
    if(!window.ethereum) return    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const user_address = currentAccount
    console.log(user_address)
    const ERC20_contract:Contract = new ethers.Contract(addressContract, abi, signer)
    
    var mindiv

    if (addressContract == '0xdAC17F958D2ee523a2206206994597C13D831ec7' || addressContract == '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
      mindiv = 6
    } else  if (addressContract == '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599') {
      mindiv = 8
    } else  {
      mindiv = 18
    }





    let amount_wei = ethers.utils.parseUnits(human_number.toString(), mindiv)  // let's suppose we got wei number in query and we just parse it
    console.log("amount to approve in wei: ", amount_wei.toString())
   // let passport_fee_wei = ethers.utils.formatUnits(1000,"wei");
    //let passport_fee_custom_gwei = ethers.utils.formatUnits(2000000,"gwei"); // 1 gwei = 1'000'000'000 wei, 2m gwei = 0,002 (estimateGas on approval = 0.02, so we need to take that fee for gas)
    //let passport_fee_wei = ethers.utils.formatUnits(passport_fee_custom_gwei,"wei");
    //let passport_fee_wei_hardcode = ethers.utils.formatUnits(2000000000000000,"wei");
    ERC20_contract.approve(ourAddress, amount_wei, {from: user_address})
     .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt:TransactionReceipt) => {console.log("approve receipt", receipt)})
        })
         .catch((e:Error) => console.log(e))
     }


  
  //const handleChange = (value:string) => setUserId(value)
  
  return (
    <form onSubmit={approveERC20}>
    <FormControl>
      
      <div>
      <div>
      <Input id="amount" type="text" placeholder="Enter amount of tokens to approve" required  onChange={(e) => setHuman_number(e.target.value)} value={human_number} my={3}/>
     <Select id="currency" placeholder="Select currency you want to approve:" onChange={(e) => setAddressContract(e.target.value)} value= {addressContract}  my={3}>
     <option value='0xdAC17F958D2ee523a2206206994597C13D831ec7'>USDT</option>
      <option value='0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'>USDC</option>
      <option value='0x6B175474E89094C44Da98b954EedeAC495271d0F'>DAI</option>
      <option value='0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'>WETH</option>
      <option value='0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'>WBTC</option>
      </Select>
     </div>
    </div>
      <Button type="submit" isDisabled={!currentAccount}>Approve</Button>
    </FormControl>
    </form>
  )
}