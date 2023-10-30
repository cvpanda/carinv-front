// ** React Imports
import { useContext, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Container from '@mui/material/Container'

import AccountOutline from 'mdi-material-ui/AccountOutline'

import 'react-datepicker/dist/react-datepicker.css'
import Companypage from 'src/views/company/Companypage'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Typography } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const Company = () => {
  // ** State
  const [value, setValue] = useState('account')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Container maxWidth='md'>
        <Box className='content-center '>
          <Card sx={{ zIndex: 1 }}>
            <Typography variant='h4' sx={{ justifyContent: 'center', display: 'flex', marginTop: '25px' }}>
              {'Detalle Empresa'}
            </Typography>
            <Companypage />
          </Card>
        </Box>
      </Container>
    </>
  )
}
Company.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Company
