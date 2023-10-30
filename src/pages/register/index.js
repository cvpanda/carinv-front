// ** React Imports
import { useState, Fragment, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import Pool from '../../service/Pool'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/router'
import { SettingsContext } from 'src/@core/context/settingsContext'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const RegisterPage = () => {
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    showconfPassword: false
  })

  const router = useRouter()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleConfiShowPassword = () => {
    setValues({ ...values, showconfPassword: !values.showconfPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup
      .string()
      .required('Contraseña requerida')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
        message:
          'Debe contener mínimo 8 caracteres, una letra mayuscula, una minuscula, un numero y un caracter especial'
      }),
    confirm_password: yup
      .string()
      .required('Completar el campo Confirmar Contraseña')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
        message:
          'Debe contener mínimo 8 caracteres, una letra mayuscula, una minuscula, un numero y un caracter especial'
      })
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmitHandler = values => {
    try {
      const email = values.email
      const password = values.password
      if (values.password !== values.confirm_password) {
        toast.error('your_password_and_confirm_password_not_match')
      } else {
        if (!email || !password) return

        const attributeArr = [
          new CognitoUserAttribute({
            Name: 'given_name',
            Value: values.email
          }),
          new CognitoUserAttribute({
            Name: 'family_name',
            Value: values.email
          }),
          new CognitoUserAttribute({
            Name: 'email',
            Value: values.email
          }),
          new CognitoUserAttribute({
            Name: 'address',
            Value: 'dummy address'
          })
        ]
        Pool.signUp(email, password, attributeArr, [], async (err, data) => {
          if (err) {
            toast.error(err.message)
          } else {
            //console.log('process.env.NEXT_PUBLIC_API_URL')
            //console.log(process.env.NEXT_PUBLIC_API_URL)
            axios
              .post(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, { ...values, user_sub: data.userSub })
              .then(res => {
                if (res.data.statusCode === 200) {
                  toast.success(res.data.massage)
                  router.push('/login')
                } else {
                  toast.error(res.data.massage)
                }
              })
              .catch(err => {
                toast.error('oops! please contact administrator')

                //console.log(err)
              })
          }
        })
      }
    } catch (error) {
      console.error(error?.massage)
    }
  }

  // ** Hook
  const theme = useTheme()

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              {'Bienvenido '}🚀
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
              fullWidth
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={Boolean(errors.email) && 'Correo requerido'}
              type='email'
              label='Correo'
              sx={{ marginBottom: 4 }}
            />
            <TextField
              sx={{ marginBottom: 4 }}
              fullWidth
              label={'Contraseña'}
              id='auth-register-password'
              type={values.showPassword ? 'text' : 'password'}
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={Boolean(errors.password) && errors.password.message}
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
            <TextField
              fullWidth
              label={'Confirmar contraseña'}
              id='auth-register-password'
              type={values.showconfPassword ? 'text' : 'password'}
              {...register('confirm_password')}
              error={Boolean(errors.confirm_password)}
              helperText={Boolean(errors?.confirm_password) && errors?.confirm_password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleConfiShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7, marginTop: 5 }}>
              {'Registrarse'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                {'Ya tengo cuenta'}
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/login'>
                  <LinkStyled>{'Iniciar sesión'}</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
