import React, { startTransition } from "react";
import Nevigation from "../Nevigation/Nevigation";
import Timer from "../TImer/TImer";
import { cont_add, cont_abi,token_abi,usdt_add } from "../config";
import { useLocation } from "react-router-dom";
import '../Nevigation/Nevigation.css'
import logo from '../Nevigation/images/logo.png';
import { useState, useEffect} from "react";
import './IVO.css';
import Web3 from "web3";


    const IVO =() =>{
      const [_address, setAddress] = useState(null);
      const [isWalletConnected, setisWalletConnected] = useState(false);
      const [IDs, setNetworkID] = useState(false);
      const [user, setUser] = useState("Connect your wallet");
    
      const [refToken, set_refToken] = useState("0");
      const [buyToken, set_boughtToken] = useState("0");
      const [total_rew, set_refRew] = useState("0");
      const [total_invest, set_refInvest] = useState("0");
      const [total_ref, set_refs] = useState("0");
      const [upper_limit, set_upper_limit] = useState("0");
      const [quantity, set_quantity] = useState("0");
      const [ref_address, set_ref_addres] = useState("");
      const [total_eaarning, set_totalEarning] = useState("0");
      const [total_investors, set_totalInvestors] = useState("");



      
          
      const [Referral, set_Referral] = useState("0");
    
      const CHAIN_ID = "56";
      const CHAIN_ID1 = "0x38";
    
      useEffect(() => {
     Start();
      }, []);
    
      // const search = useLocation().search;
      // const id = new URLSearchParams(search).get("ref");


      async function Start() {
        try {
          // Get network provider and web3 instance.
          const web3 = new Web3(window.ethereum);
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          // const tokenContract = tokenContractAddress;
          //const investContract = InvestAddress;
    
          const contract = new web3.eth.Contract(cont_abi, cont_add);
         
          const upper_limit = await contract.methods.get_current_upperLimit().call();        
          const quantity = await contract.methods.get_current_quantity().call();  
          const total_investors = await contract.methods.total_investors().call();        
          const total_earning = await contract.methods.total_earning().call();      

          set_totalEarning(total_earning)
          set_totalInvestors(total_investors)
          set_upper_limit(upper_limit);
          set_quantity(quantity);
        } catch (error) {
          console.error(error);
        }
      }





    
      async function mount() {
        try {
          // Get network provider and web3 instance.
          const web3 = new Web3(window.ethereum);
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          // const tokenContract = tokenContractAddress;
          //const investContract = InvestAddress;
    
          const contract = new web3.eth.Contract(cont_abi, cont_add);
          let ref_token = await contract.methods.get_claim_ref_tokens().call({from:accounts[0]});
          let bought_token = await contract.methods.get_claimable_tokens().call({from:accounts[0]});
          let total_ref_reward = await contract.methods.get_total_ref_rew().call({from:accounts[0]});
          let total_investmentOf_ref = await contract.methods.get_total_ref_invest().call({from:accounts[0]});
          // const upper_limit = await contract.methods.get_current_upperLimit().call();        
          // const quantity = await contract.methods.get_current_quantity().call();        

          let total_referrals = await contract.methods.get_total_ref().call({from:accounts[0]});

          set_refToken(ref_token);
          set_boughtToken(bought_token);
          set_refRew(total_ref_reward);
          set_refInvest(total_investmentOf_ref);
          set_refs(total_referrals);
          // set_upper_limit(upper_limit);
          // set_quantity(quantity);
        } catch (error) {
          console.error(error);
        }
      }
    
      async function connectWallet() {
        if (!window.ethereum) {
          alert(
            "it looks like that you dont have metamask installed,please install"
          );
          return;
        }
    
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const networkId = await window.ethereum.request({
            method: "net_version",
          });
          setNetworkID(networkId);
    
          // console.log(IDs)
          if (networkId == CHAIN_ID) {
            setisWalletConnected(true);
            console.log("its in net" + isWalletConnected);
    
            setAddress(window.ethereum.selectedAddress);
            mount();
            return _address;
          } else {
            window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: CHAIN_ID1 }],
            });
          }
        } catch (err) {
          alert("Something went wrong.");
        }
      }
      try {
        window.ethereum.on("chainChanged", hello);
        window.ethereum.on("accountsChanged", hello);
      } catch {}
    
      function hello() {
        window.location.reload();
      }

      async function Buy_token(){
          console.log("itsref "+ref_address);
        const web3 = new Web3(window.ethereum);
    
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        console.log("network id  "+networkId);
        const contract = new web3.eth.Contract(cont_abi, cont_add);
        const token_contract = new web3.eth.Contract(token_abi, usdt_add);
        const upper_limit = await contract.methods.get_current_upperLimit().call();        
        console.log("upper limit"+upper_limit);
        let userBalance = await token_contract.methods.balanceOf(accounts[0]).call();        
        userBalance=web3.utils.fromWei(userBalance,"ether");
        if( parseInt(userBalance) < parseInt(upper_limit))
        {
          alert("you dont have enoungh usdt to buy");
          return;
        }
        userBalance = web3.utils.toWei(upper_limit,"ether");

        console.log(userBalance);
        const  temp= await token_contract.methods.approve(cont_add,userBalance).send({from:accounts[0]});
       console.log("jhgdwfbvchjsdui "+temp);
        if(temp){

            if(await contract.methods.buy_tokens(ref_address).send({
              from:accounts[0]
            }))
            {
              alert("You successfully bought the tokken");
              Start();
              mount();
            }
            else{
              alert("oops! something went wrong with buying")
           }

       }else{
          alert("oops! something went wrong");
       }

      }



      async function claim_bought_tokens(){

        const web3 = new Web3(window.ethereum);
    
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
  
        const contract = new web3.eth.Contract(cont_abi, cont_add);
        const endTime = await contract.methods.time_end().call();      
        const curr_time = await contract.methods.get_currTime().call();        
        console.log(endTime);

        const claimable_tokens = await contract.methods.get_claimable_tokens().call({from:accounts[0]});        
        if(claimable_tokens<=0)
        {
          alert("you dont have tokens to claim");
          return;
        }
        if(endTime==0 || endTime>curr_time){
          alert("you need to wait until your token release!");  
          return;
        }
        if(await contract.methods.claim_bought_tokens().send({from:accounts[0]})){
          alert("Your tokens have been transferred in to your account");
          Start();
          mount();
        }        
        


      }

      async function claim_ref_tokens(){

        const web3 = new Web3(window.ethereum);
    
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
  
        const contract = new web3.eth.Contract(cont_abi, cont_add);
        const endTime = await contract.methods.time_end().call();      
        const curr_time = await contract.methods.get_currTime().call();        
  

        const claimable_tokens = await contract.methods.get_claim_ref_tokens().call({from:accounts[0]});        
        if(claimable_tokens<=0)
        {
          alert("you dont have tokens to claim");
          return;
        }
        if(endTime==0 || endTime>curr_time){
          alert("you need to wait until your token release!");  
          return;
        }
        if(await contract.methods.claim_ref_tokens().send({from:accounts[0]})){
          alert("Your reward have been transferred in to your account");
          Start();
          mount();
        }        
        


      }
      









    return(
        <section className="main_section">
        <section className="Nevigation">

<div className="main_nav">


<div className="logo">
    <img src={logo}></img>
</div>
{/* <div className="links">
    <a href="#">Home</a>
    <a href="#">IDO</a>
    <a href="#">My account</a>
    <a href="#">Dashboard</a>
    <a href="#">Whitepaper</a>
    <a href="#">Language</a>

</div> */}
{isWalletConnected?(<div className="button_connect" onClick={connectWallet}>
<a >{_address.slice(0,4)  +"...." +_address.slice(39,42)}</a>    
</div> ):(<div className="button_connect" onClick={connectWallet}>
<a >Connect Wallet</a>    
</div> )}


</div>

</section>
            <Timer></Timer>

            <div className="participation">
                <div className="amount">
                    <h1>IDo Participation Amount</h1>
                    <h1>{total_eaarning+" "}USDT</h1>
                </div>
                <div className="person">
                    <h1>IDO Participation Persons</h1>
                    <h1>{total_investors}</h1>
                </div>
            </div>


            <div className="rules_div">
                <h1>Join IDO</h1>
                <div className="rule_box_1">
                    <h2>Referrer's Address</h2>
                    <h1>|</h1>
                    <input onChange={(e) => set_ref_addres(e.target.value)}  type='text'value={ref_address} placeholder="Please fill in the reffer's address"></input>


                </div>


                <div className="rule_box_2">
                    <h1>Price 1USDT = 100DWD<span></span></h1>
                    <p>expeected</p>
                    <h1>10,000 DWD<span></span></h1>
                </div>

                {isWalletConnected?(<div className="click" onClick={Buy_token}>
                    <a >click</a>
                </div>
                ):(<div className="click" disabled>
                    <a >click</a>
                </div>)}
                
                <div className="rule_price">
                    <h1>Price  1USTD = {quantity/upper_limit+" "} DWD</h1>
                </div>

                <hr></hr>


                <div className="rule_common_div">
                  <div className="text">$DWD Bought</div>
                  <div className="number">{buyToken}</div>

                  
                {isWalletConnected?( <div className="btn" onClick={claim_bought_tokens}><a>Claim</a></div>
                ):(<div className="click" disabled>
                    <a >claim</a>
                </div>)}

                </div>

                {/* <div className="rule_common_div">
                  <div className="text">$RAC Awaiting Release</div>
                  <div className="number">0</div>
                  <div className="btn"></div>

                </div> */}


                <div className="rules">
                    <h1>IDO Rules</h1>
                    <p><span className="rule_number">1:</span>There is no limit to the amount of IDO,  and the initial price is 0.01 USDT. </p>
                    <p><span className="rule_number">2:</span> The quota for a single address is fixed at 100U (purchase at most). </p>
                    <p><span className="rule_number">3:</span>To participate in IDO, you need to fill in the address first to confirm the referral. </p>

                    <p><span className="rule_number">4:</span>You can get DWD and NFT rewards once you successfully invite friends to participate IDO. </p>
                    <p><span className="rule_number">5:</span>After $DWD is launched on PancakeSwap, you can go to the official website to receive the unlocked $DWD.  </p>
                    {/* <p><span className="rule_number">6:</span>After $DWD is launched on PancakeSwap, you can go to the official website to receive the unlocked $DWD. </p> */}
                </div>

            </div>



            <div className="referals_div">
            <h1>IDO rewards AMOUNT</h1>
            <div className="rule_common_div">
                  <div className="text">$DWD Referral Reward</div>
                  <div className="number">{refToken}</div>
                  {isWalletConnected?( <div className="btn" onClick={claim_ref_tokens}><a>Claim</a></div>
                ):(<div className="click" disabled>
                    <a >claim</a>
                </div>)}
                </div>
                {/* <div className="rule_common_div">
                  <div className="text">$RAC Awaiting Release</div>
                  <div className="number">0</div>
                  <div className="btn"></div>

                </div> */}
                <div className="rule_common_div">
                  <div className="text">NFT to be claimed</div>
                  <div className="number">0</div>
                  {isWalletConnected?( <div className="btn" ><a>Claim</a></div>
                ):(<div className="click" disabled>
                    <a >claim</a>
                </div>)}
                </div>


                <div className="scale_div">
                    <h2>Invite 10 more people to receive and NFT</h2>
                    <div className="scale_inner">
                        <div className="scale"></div>
                        {total_ref<=10?(<div className="rating">{"("+total_ref+"/10)"}</div>):(<div className="rating">{"(10/10)"}</div>
)}
                    </div>
                </div>


                <div className="rules">
                    {/* <h1>IDO Rules</h1> */}
                    <p><span className="rule_number">1:</span>You will be rewarded 5% tokens of the amount of IDO that the invitee purchase if you invite him directly, or you could get 4% tokens of the amount of IDO that the user purchases if your invitee invites the people.</p>
                    <p><span className="rule_number">2:</span> You could get 1 NFT as the reward if you invite 10 users to participate in IDO. You could get 1 NFT per 10 valid referrals. No limit in this process, for instance, you may get 5 NFTs if you get 50 valid referrals.</p>
                    <p><span className="rule_number">3:</span> After $DWD is launched on PancakeSwap, you can go to the official website to receive the unlocked $DWD. </p>

                    {/* <p><span className="rule_number">4:</span>After $DWD is launched on PancakeSwap, you can go to the official website to receive the unlocked $DWD.</p> */}
                    



                    </div>


            </div>



            <div className="details_div">
                <h1>
                    DETAILS OF REFERALS AWARDS I RECEIVED
                </h1>
                <div className="details_inner">
                    <div className="details_steps">
                        <div className="step">
                            <h1>Total Team Size</h1>
                            <h1>{total_ref+" DWD"}</h1>

                        </div>
                        <div className="step">
                            <h1>Total Team Buy</h1>
                            <h1>{total_invest}</h1>

                        </div>
                        <div className="step">
                            <h1>My Total Rewards</h1>
                            <h1>{total_rew}</h1>

                        </div>

                    </div>

                    

                    {/* <div className="details_link">
                        <ul>
                            <li>Referred user</li>
                            <li>Address</li>
                            <li>IDO amount</li>
                            <li>Buy time</li>
                            <li>Rewards</li>
                        </ul>
                    </div> */}

                    {/* <hr className="last_line"></hr> */}
                </div>

            </div>

            <div className="my_nft">
                <h1><snap className="contract">NFT Contract Address</snap></h1>
               
               <h2> <span className="address">0x17e2d77ec3ae22ce79e6848492a69d69d005d025</span></h2>
            </div>


            <div className="last_div">
                <div className="rules">
                <h3>Dino World DAO NFTs are the core signals of the DWD ecosystem. With the development of the project, in addition to the fee dividends, it will also receive that as below:</h3>
                    <p><span className="rule_number">1:</span>Dividends from advertising platform revenue </p>
                    <p><span className="rule_number">2:</span> Earning dividends from NFTs trade platform  </p>
                    <p><span className="rule_number">3:</span>Metaverse dApps Token airdrop  </p>

                    <p><span className="rule_number">4:</span>Free file usage storage </p>
                    <p><span className="rule_number">5:</span>Dividends of other web3 dApps benefits in the future  </p>
                    <p><span className="rule_number">6:</span>A The preemptive right of purchase Metaverse Space(Space is more valuable than Land)  </p>
              
                    
                    
                    
                    
                    
                    
                    {/* <h2 className="rule_number">1:</h2><p>  Dividends from advertising platform revenue   </p>
                    <h2 className="rule_number">2:</h2><p>  Earning dividends from NFTs trade platform   </p>
                    <h2 className="rule_number">3:</h2><p>  Metaverse dApps Token airdrop   </p>
                    <h2 className="rule_number">4:</h2><p>  Free file usage storage  </p>
                    <h2 className="rule_number">5:</h2><p>  Dividends of other web3 dApps benefits in the future </p>
                    <h2 className="rule_number">6:</h2><p>  The preemptive right of purchase Metaverse Space(Space is more valuable than Land) </p> */}
                    </div>


            </div>

        </section>
    )
}

export default IVO;