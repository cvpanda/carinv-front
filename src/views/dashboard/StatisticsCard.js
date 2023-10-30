// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { useContext } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'

const StatisticsCard = ({ data }) => {
  const TotalSales = data?.sale?.[1]?.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)

  const Totalmargin = data?.margin?.[1]?.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)

  const TotalPurchase = data?.purchase?.[1]?.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)
  if (data?.charges && typeof data?.charges === 'object') {
    var totalCharges = Object.values(data?.charges).reduce((accumulator, currentValue) => {
      //console.log(currentValue);
      const sum = currentValue?.reduce((acc, val) => acc + val, 0)

      return accumulator + sum
    }, 0)
  }

  const formatNumberWithDots = number => {
    if (typeof number !== 'number') {
      return number // Return as is if it's not a valid number
    }

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const salesData = [
    {
      stats: formatNumberWithDots(TotalSales),
      title: 'Ventas',
      color: 'primary',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: formatNumberWithDots(TotalPurchase),
      title: 'Compras',
      color: 'success',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: formatNumberWithDots(Totalmargin),
      color: 'warning',
      title: 'Margen',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: data?.charges && typeof data?.charges === 'object' ? formatNumberWithDots(totalCharges) : 0,
      color: 'info',
      title: 'Cargos',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    }
  ]

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title={`${'Total Año '} ${new Date().getFullYear()}`}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
