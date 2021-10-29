import React from 'react'
import { frmatAccount } from '../utils/shortaccount'

function EthAccount({account}) {
    return (
        <div style={{
                display:'flex', 
                justifyContent:'flex-end', 
                color:'yellow',
                fontSize: '1.2em',
                fontWeight: 'bold',
                marginTop:'15px',
                marginRight: '25px'
            }}
                >
             Account: &nbsp;{frmatAccount(account) } 
        </div>
    )
}

export default EthAccount
