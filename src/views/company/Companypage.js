// ** React Imports
import { forwardRef, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useForm } from 'react-hook-form'
import { SettingsContext } from 'src/@core/context/settingsContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { Autocomplete } from '@mui/material'
import { getCityState } from 'src/service/Car'
import { AccountContext } from 'src/service/Account'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const Companypage = () => {
  const router = useRouter()
  const { saveUsers, users, saveLoadings } = useContext(SettingsContext)
  const { signOut } = useContext(AccountContext)

  // ** State
  const [date, setDate] = useState(null)
  const [citystate, setcitystate] = useState([])
  const [state, setstate] = useState('')

  const schema = yup.object().shape({
    company_name: yup.string().required('nombre requerido'),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required().default('Chile'),
    contact_email: yup.string().required(),
    contact: yup.string().required(),
    rut_number: yup.string().required('rut requerido')
  })

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmitHandler = async values => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user/add-company/${users.data._id}`, values, {
        headers: { Authorization: `Bearer ${users.token}` }
      })
      .then(async res => {
        if (res?.data?.statusCode === 200) {
          toast.success(res.data.massage)
          saveUsers(res?.data)
          localStorage.setItem('users', JSON.stringify(res?.data))
          router.push('/')
        } else {
          if (res?.data.massage === 'Token expired') {
            await signOut()
            saveUsers({})
            localStorage.clear()
            router.push('/login')
          }
          toast.error(res.data.massage)
        }
      })
      .catch(err => {
        toast.error(`${err.message}`)
      })
  }

  const handlecitydata = async () => {
    const token = users?.token

    const citystatedata = await getCityState({ token })
    setcitystate(citystatedata?.data)
    saveLoadings(false)

    if (citystatedata?.massage === 'Token expired') {
      await signOut()
      saveUsers({})
      localStorage.clear()
      router.push('/login')
    }
  }
  useEffect(() => {
    saveLoadings(true)
    handlecitydata()
  }, [users])

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid container spacing={7}>
          <Grid item xs={6} sm={6} sx={{ marginTop: '25px' }}>
            <TextField
              fullWidth
              type='text'
              label={'Nombre Empresa'}
              {...register('company_name')}
              error={Boolean(errors.company_name)}
              helperText={Boolean(errors.company_name) && 'Nombre Empresa requerido'}
            />
          </Grid>
          <Grid item xs={6} sm={6} sx={{ marginTop: '25px' }}>
            <TextField fullWidth type='text' label={'Dirección'} {...register('address_line_one')} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              fullWidth
              type='text'
              label={'Persona a cargo'}
              {...register('person_in_charge')}
              error={Boolean(errors.person_in_charge)}
              helperText={Boolean(errors.person_in_charge) && 'Persona a cargo requerido'}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={citystate?.map((item, i) => item?.region && item.region)}
              onChange={(e, val) => {
                setstate(val)
                setValue('state', val)
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.state)}
                  helperText={Boolean(errors.state) && errors.state.message}
                  label={'Region'}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              autoComplete={false}
              id='combo-box-demo'
              options={
                state.length !== 0 && state !== null
                  ? citystate?.filter((item, i) => item?.region === state)[0]?.city.split(',')
                  : []
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.city)}
                  helperText={Boolean(errors.city) && errors.city.message}
                  {...register('city')}
                  label={'Ciudad'}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label={'País'}
              defaultValue='Chile'
              {...register('country')}
              error={Boolean(errors.country)}
              helperText={Boolean(errors.country) && 'País requerido'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label={'Correo de contacto'}
              {...register('contact_email')}
              error={Boolean(errors.contact_email)} //errors.postal_code
              helperText={Boolean(errors.contact_email) && 'Correo de contacto requerido'} //errors.postal_code
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label={'Teléfono de contacto'}
              {...register('contact')}
              error={Boolean(errors.contact)}
              helperText={Boolean(errors.contact) && 'Teléfono de contacto requerido'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Rut'
              {...register('rut_number')}
              error={Boolean(errors.rut_number)}
              helperText={Boolean(errors.rut_number) && 'RUT requerido'}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type={'submit'} variant='contained' sx={{ marginRight: 3.5 }}>
              {'Guardar'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default Companypage
