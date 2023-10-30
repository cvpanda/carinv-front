// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { useContext } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'

const Inventory = ({ inventory = [] }) => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      id: 'inventoryChart',
      type: 'polarArea'
    },
    stroke: {
      colors: ['#00000000']
    },
    fill: {
      opacity: 1
    },
    yaxis: {
      labels: {
        formatter: (value, index) => value.toFixed(1)
      },
      tickAmount: inventory.length ? inventory.length : 5
    },
    labels: ['1-30 Días', '30-60 Días', '60-90 Días', '90+ Días'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'top'
          }
        }
      }
    ]
  }

  const inventorydata = inventory

  return (
    <Card>
      <CardHeader
        title={'Gráfico Inventario'}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='polarArea' height={405} options={options} series={inventorydata} />
      </CardContent>
    </Card>
  )
}

export default Inventory
