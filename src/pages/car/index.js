import { Typography } from '@mui/material'
import { Grid } from '@mui/material'
import React from 'react'
import AddCarForm from 'src/views/form-layouts/AddCarForm'

const index = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <AddCarForm />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default index