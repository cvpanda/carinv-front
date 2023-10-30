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

const Sell = ({ margin, months = [] }) => {
  // ** Hook

  const theme = useTheme()

  const options = {
    chart: {
      id: 'sellChart',
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '8px',
              fontWeight: 900
            }
          }
        }
      }
    },
    xaxis: {
      type: 'month',
      categories: months
    },
    legend: {
      position: 'right',
      offsetY: 0
    },
    fill: {
      opacity: 1
    }
  }

  const data = [
    {
      data: margin
    }
  ]

  return (
    <Card>
      <CardHeader
        title={'Gráfico Ventas'}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='bar' height={405} options={options} series={data} />
      </CardContent>
    </Card>
  )
}

export default Sell
