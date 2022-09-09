import React, { useEffect, useState } from "react";
import './Nevigation.css'
import logo from './images/logo.png';
const Nevigation = (props)=>{

    useEffect(()=>{

    },props.user_address);

    const[user_address, set_address]=useState("");

    return(
        <section className="Nevigation">

            <div className="main_nav">

            
            <div className="logo">
                <img src={logo}></img>
            </div>
            {/* <div className="links">
                <a href="#">Home</a>
                <a href="#">IVO</a>
                <a href="#">My account</a>
                <a href="#">Dashboard</a>
                <a href="#">Whitepaper</a>
                <a href="#">Language</a>

            </div> */}
            <div className="button_connect" onClick={props.connectWallet}>
            <a >{props.user_address}</a>    
            </div> 

            </div>

        </section>
    )
}

export default Nevigation;