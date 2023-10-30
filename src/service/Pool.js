import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'sa-east-1_fake',
  ClientId: '12345fake'
}

const UserPool = new CognitoUserPool(poolData)

export default UserPool
