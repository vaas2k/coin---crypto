import './crypto.css';
import { crypto_details } from '../../api/external';
import { useState, useEffect } from 'react';
import info from './data'

const Crypto = () => {

    const [details, setDetails] = useState([]);


        const coins = info.map((coin) => {
            let styles ;
            if(coin.price_change_24h > 0){
                styles = { 
                    color : "green"
                }
            }else if (coin.price_change_24h < 0){
                styles = { 
                    color : "red"
                }
            }else if(coin.price_change_24h === coin.current_price){
                styles = { 
                    color : "white"
                }
            }

            return(
                <div className='contain-crypto-table' key={coin.symbol}>
            <img  className="cryp-img" src={coin.image}></img>
            <h3 id='item1'>{coin.name}</h3>
            <h4 id='item1'>{coin.symbol}</h4>
            <div id='item1'>{coin.current_price}</div>
            <h3 id='item1' style={styles}>{coin.price_change_24h}</h3>
        </div>
            );
        })

    return (
        <div className='Crypto'>
            <div className='contain-crypto-table'>
                <h3 id='item1'>#</h3>
                <h3 id='item1'>Coin</h3>
                <h3 id='item1'>Symbol</h3>
                <h3 id='item1'>Price</h3>
                <h3 id='item1'>24hr</h3>
            </div>
            {coins}
            
        </div>
    )
}

export default Crypto;

/*
<table className='table'>
                    <tr className='row'>
                        <td className='col'>
                            #
                        </td>
                        <td className='col'>
                            Coin
                        </td>
                        <td className='col'>
                            Symbol
                        </td>
                        <td className='col'>
                            24h
                        </td>
                    </tr>
                </table>
*/