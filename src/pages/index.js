// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
// import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/Charges'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { useContext, useEffect, useState } from 'react'
import Margin from 'src/views/dashboard/Margin'
import Inventory from 'src/views/dashboard/Inventory'
import { getDashboard, getUserData } from 'src/service/Car'
import Sell from 'src/views/dashboard/Sell'
import Purchase from 'src/views/dashboard/Purchase'
import { Typography } from '@mui/material'
import { AccountContext } from 'src/service/Account'
import axios from 'axios'
import { useRouter } from 'next/router'

const Dashboard = () => {
  const { isLoading, users, saveLoadings } = useContext(SettingsContext)
  const [data, setData] = useState([])
  const { getSession } = useContext(AccountContext)
  const route = useRouter()

  const handleDashboardData = async () => {
    const userSession = await getSession()

    //console.log(41, userSession)
    const token = userSession?.accessToken.jwtToken
    const user_sub = userSession?.accessToken.payload.username
    const userid = await getUserData(token, user_sub)
    const dashboardData = await getDashboard(token, userid?.data?._id)
    setData(dashboardData)
    saveLoadings(false)

    if (userSession === null) {
      route.push('/login')
    }
  }

  useEffect(() => {
    saveLoadings(true)
    setTimeout(() => {
      handleDashboardData()
    }, 2000)
  }, [route.asPath])

  return (
    <>
      {!isLoading && (
        <>
          {data?.purchase_price?.length !== 0 && data?.purchase_price?.length !== null ? (
            <ApexChartWrapper>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <StatisticsCard data={data} />
                </Grid>
                <Grid item xs={12}>
                  <WeeklyOverview charges={data?.charges} months={data?.monthData} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Margin margin={data?.margin?.[1]} months={data?.margin?.[0]} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Sell margin={data?.sale?.[1]} months={data?.sale?.[0]} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Purchase
                    margin={data?.purchase?.[1]}
                    months={data?.purchase?.[0]}
                    newCarCount={data?.purchase?.[2]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Inventory inventory={data?.inventory} />
                </Grid>
              </Grid>
            </ApexChartWrapper>
          ) : (
            <Grid container justifyContent={'center'}>
              <Typography variant='h3' component='h2'>
                Oops!! Data are Not Available
              </Typography>
            </Grid>
          )}
        </>
      )}
    </>
  )
}

export default Dashboard
