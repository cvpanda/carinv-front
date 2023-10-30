// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import toast, { Toaster } from 'react-hot-toast'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { useContext } from 'react'
import { AccountContext } from 'src/service/Account'
import axios from 'axios'
import { SettingsContext } from 'src/@core/context/settingsContext'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const { saveUsers, users } = useContext(SettingsContext)

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const { authenticate, signOut } = useContext(AccountContext)

  const schema = yup.object().shape({
    email: yup.string().required('email requerido'),
    password: yup.string().min(8).max(32).required()
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmitHandler = async values => {
    try {
      const email = values.email
      const password = values.password
      if (!email || !password) return
      const awsdata = await authenticate(email, password)
      if (awsdata) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            { user_sub: awsdata?.accessToken?.payload.username },
            {
              headers: { Authorization: `Bearer ${awsdata?.accessToken?.jwtToken}` }
            }
          )
          .then(res => {
            if (res?.data?.statusCode === 200) {
              localStorage.setItem('users', JSON.stringify(res.data))
              saveUsers(res.data)
              toast.success(res.data.massage)

              if (res.data.data.company_details === null) {
                router.push('/company/create')
              } else {
                router.push('/')
              }
            } else {
              toast.error(res.data.massage)
            }
          })
          .catch(err => {
            //console.log(err.message)
            toast.error('oops! please contact administrator')
          })
      } else {
        toast.error('Authentication failed')
      }
    } catch (error) {
      //console.log(error?.message)
      if (error?.message == `Incorrect username or password.`) {
        toast.error('User not registered with this email id')
      } else {
        toast.error('Click on Verification Email link sent on your email id')
      }
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              {'Bienvenido a '} {themeConfig.templateName}! 👋🏻
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
              fullWidth
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={Boolean(errors.email) && 'Correo requerido'}
              type='email'
              label={'Correo'}
              sx={{ marginBottom: 4 }}
            />
            <TextField
              fullWidth
              label={'Contraseña'}
              id='auth-register-password'
              type={values.showPassword ? 'text' : 'password'}
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={Boolean(errors.password) && 'Contraseña Requerida'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel control={<Checkbox />} label={'Recordarme'} />
              <Link passHref href='/'>
                <LinkStyled onClick={e => e.preventDefault()}>Olvidó su contraseña?</LinkStyled>
              </Link>
            </Box>
            <Button type={'submit'} fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }}>
              Ingresar
            </Button>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
             <Typography variant='body2'>
                <Link passHref href='/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box> */}
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
