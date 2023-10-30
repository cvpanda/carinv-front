import { useContext, useState } from 'react'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { SettingsContext } from 'src/@core/context/settingsContext'

const TabAccount = () => {
  // ** State
  const { saveUsers, users } = useContext(SettingsContext)
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }
  const profiledata = users.data

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={4} sx={{ padding: '12px' }}>
          <Grid item xs={6} gutterBottom>
            {'Correo'} : <span style={{ color: '#e7e3fcad' }}>{profiledata?.email}</span>
          </Grid>
          <Grid item xs={6}>
            {'Rol'} : <span style={{ color: '#e7e3fcad' }}>{profiledata?.role}</span>
          </Grid>
          <Grid item xs={6} gutterBottom>
            {'Nombre Empresa'} :<span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.company_name}</span>
          </Grid>
          <Grid item xs={6}>
            {profiledata?.company_details?.address_line_one && (
              <>
                {'Dirección'} :
                <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.address_line_one}</span>{' '}
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            {profiledata?.company_details?.person_in_charge && (
              <>
                {' '}
                {'Persona a cargo'} :{' '}
                <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.person_in_charge}</span>{' '}
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            {'City'} : <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.city}</span>
          </Grid>
          <Grid item xs={6}>
            {'State'} : <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.state}</span>
          </Grid>
          <Grid item xs={6}>
            {'País'} : <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.country}</span>
          </Grid>
          <Grid item xs={6}>
            {'Teléfono de contacto'} :
            <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.contact}</span>
          </Grid>
          <Grid item xs={6}>
            {'Correo de contacto'} :
            <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.contact_email}</span>
          </Grid>
          <Grid item xs={6}>
            Rut : <span style={{ color: '#e7e3fcad' }}>{profiledata?.company_details?.rut_number}</span>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TabAccount
