/**
 * All Web3 connecction methods
 */


export const { ethereum } = window
export const networks = {
    '1':'Mainnet',
    '3':'Ropsten', 
    '4':'Rinkeby',
    '5':'Goerli',
    '42': 'Kovan',
    '80001': 'Matic Mumbai' 
};

// List of error coming from Metamask Wallet
export const errorMsjs = {
   '-32002': 'There is a Metamask window already opened',
     '4001':  'User rejected request'
}


 /*******************************************************************
 *  getEthAddress - 
 *        Check if we already  have  permissions to Metamask account
 *       returns: 
 *            object with properties:
 *            opcode: true, value: accounts[0]: Metamask's Account connected if there is one 
 *            opcode: false  errorCode: error code from Metamask if not
 * 
 *****************************************************************/
export const  getEthAddress = async () => {
    try {
        if (ethereum) {
          const accounts = await ethereum.request({method: 'eth_requestAccounts'})
          return {opcode: true, value: accounts}
          }
        else {
          return {opcode: false, errorCode:'No Metamask detected'}
          }
      } catch (error) {
         console.log('There is not account connected', error)
         console.log('Code:', error.code)
         console.log('Msg:', error.message)
         const mmError = parseInt(error.code)
         console.log('result!:', mmError)
         let errorMsj=''
         errorMsj = errorMsjs[String(mmError)]
         console.log('errorMsj',errorMsj)
         return {opcode: false, errorCode: error.code, message : errorMsj}
      }    
}


 /*******************************************************************
 *  checkMMAccounts - 
 *        Check if we already  have  permissions to Metamask account
 *       returns: 
 *            object with properties:
 *            opcode: true, value: accounts[0]: Metamask's Account connected if there is one 
 *            opcode: false  errorMsg: error code from Metamask if not
 * 
 *****************************************************************/
  export const checkMMAccounts = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({method: 'eth_accounts'})
        console.log('ckhmmacc', accounts)
        console.log('accounts.lenght',accounts.length)
        if (accounts.length===0) 
          {
              return {opcode: false, errorMsg: 'Unlock Metamask Wallet'} //  metamask locked/not connected}
          } else 
            return {opcode: true, value: accounts}  // all right
        } else {
        return {opcode: false, errorMsg:'This Dapp requires Metamask, please install it.'}
        }
    } catch (error) {
       console.log('There is not account connected', error)
       return {opcode: false, errorMsg: error.code}
    }
    }