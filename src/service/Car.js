import axios from 'axios'
import UserPool from './Pool'

const baseURL = process.env.NEXT_PUBLIC_API_URL

const getCognitoSession = () => {
  const cognitoUser = UserPool.getCurrentUser()

  if (cognitoUser != null) {
    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        } else {
          resolve(session)
        }
      })
    })
  } else {
    throw new Error('No Cognito user found.')
  }
}

export const getToken = async () => {
  const session = await getCognitoSession()
  if (session) {
    return session.getAccessToken().getJwtToken()
  }
}

export const addNewCar = async ({ data, token }) => {
  return axios
    .post(`${baseURL}/car/add`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const publishCar = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/publish/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const sellCar = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/sell/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const addTask = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/add-task/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const addCharge = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/addcharge/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const addCommission = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/addcommission/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getCommissionData = async ({ token }) => {
  return axios
    .get(`${baseURL}/commission/`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const inspectionCar = async ({ data, token, id }) => {
  return axios
    .post(`${baseURL}/car/inspection-date/${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getCars = async ({ token, users }) => {
  return axios
    .get(`${baseURL}/car/user/${users.data?._id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getSingleCars = async ({ token, id }) => {
  return axios
    .get(`${baseURL}/car/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getCityState = async ({ token }) => {
  return axios
    .get(`${baseURL}/citystate`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getDashboard = async (token, userid) => {
  if (userid !== undefined) {
    const chargesData = await axios
      .get(`${baseURL}/dashboard/charges/${userid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        return {
          charges: res.data.data.charges,
          monthData: res.data.data.monthData
        }
      })
      .catch(err => {
        return err.message
      })

    const inventoryData = await axios
      .get(`${baseURL}/dashboard/inventory/${userid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        return res.data.data
      })
      .catch(err => {
        return err.message
      })

    const purchaseData = await axios
      .get(`${baseURL}/dashboard/purchase/${userid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        return res.data.data
      })
      .catch(err => {
        return err.message
      })

    const saleData = await axios
      .get(`${baseURL}/dashboard/sales/${userid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        return res.data.data
      })
      .catch(err => {
        return err.message
      })

    const marginData = await axios
      .get(`${baseURL}/dashboard/margin/${userid}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        return res.data.data
      })
      .catch(err => {
        return err.message
      })

    return {
      ...chargesData,
      margin: marginData,
      inventory: inventoryData,
      purchase: purchaseData,
      sale: saleData
    }
  } else {
    return {
      charges: {
        DyP: [0],
        Vidrio: [0],
        Neumáticos: [0],
        'Arreglo mecánico': [0],
        'Arreglo eléctrico': [0]
      },
      monthData: [''],
      margin: [[''], [0]],
      inventory: [0, 0, 0, 0],
      purchase: [[''], [0]],
      sale: [[''], [0]]
    }
  }
}

export const getUserData = async (token, user_sub) => {
  return axios
    .post(`${baseURL}/login`, { user_sub }, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}

export const getbrandModel = async () => {
  return axios
    .get(`${baseURL}/car.json`)
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err.message
    })
}
