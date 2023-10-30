import { CognitoUserPool } from 'amazon-cognito-identity-js'

//DESCOMENTAR
//COMENTAR

const poolData = {
  UserPoolId: 'sa-east-1_sBWQgMjst', //prod'sa-east-1_sIILFybeB', //qa 'sa-east-1_sBWQgMjst',// us-east-1_ti4m5Dzd7
  ClientId: '30iggs2dg9hui9j411soijbkmi' //prod'3t7sl05m4b2iacljjnc1nts3um', //qa '30iggs2dg9hui9j411soijbkmi' // 5djkmkfpce2j01g83rthvuj8ca
}

const UserPool = new CognitoUserPool(poolData)

export default UserPool
