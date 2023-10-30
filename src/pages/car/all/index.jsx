import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { AccountContext } from 'src/service/Account'
import { getCars } from 'src/service/Car'
import Table from 'src/views/dashboard/Table'

const all = () => {
  const { users, saveUsers, saveLoadings, isLoading } = useContext(SettingsContext)
  const { signOut } = useContext(AccountContext)
  const [cars, setCars] = useState([])
  const router = useRouter()
  
  const handleFetchCars = async () => {
    saveLoadings(true)
    const token = users.token

    if (token) {
      const carData = await getCars({ token, users })
      if (carData.statusCode === 200) {
        setCars(carData?.data)
      }
      saveLoadings(false)
    }
  }

  useEffect(() => {
    handleFetchCars()
  }, [users])

  return (
    <Grid item xs={12}>
      <Table cars={cars} />
    </Grid>
  )
}
export default all
