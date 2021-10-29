import React from 'react'



export const shortAccount = (address) => {
    const upAccount = address
    return (upAccount.slice(0,5) + '...' + upAccount.slice(37,42))
}
export const frmatAccount = (account) => {
return (
    <div > 
    <span >
          {shortAccount(account)}
    </span>
    </div>
)
}