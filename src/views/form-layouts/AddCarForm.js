import { forwardRef, useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Box } from '@mui/material'
import { addNewCar, getbrandModel } from 'src/service/Car'
import { useContext } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import AWS from 'aws-sdk'
import { useEffect } from 'react'

const AddCarForm = () => {
  const [date, setDate] = useState(null)
  const [purchaseDate, setPurchaseDate] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [brandmodel, setbrandmodel] = useState([])
  const [modelData, setModelData] = useState([])
  const [versionData, setVersionData] = useState([])
  const [inventory, setInventory] = useState(0)

  const { isLoading, users, saveLoadings } = useContext(SettingsContext)
  const router = useRouter()
  const token = users?.token

  //image: yup.string().required('Image is required'),

  const schema = yup.object().shape({
    brand: yup.string().required(),
    model: yup.string().required(),
    Year: yup.number().required(),
    millage: yup.string().required(),
    version: yup.string().required(),
    purchase_price: yup.string().required(),
    purchase_date: yup.string().required(),
    license_number: yup.string().required(),
    image: yup.string().optional(''),
    charges_items: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required(),
        charge_date: yup.string().required()
      })
    )
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm({
    resolver: yupResolver(schema),
    defaultValue: {
      year: '',
      image: ''
    }
  })
  const { fields, append, remove } = useFieldArray({ name: 'charges_items', control })

  const handleAddChargeItem = () => {
    append({ name: '', price: 0 })
  }

  const handleRemoveChargeItem = i => {
    remove(i)
  }

  const inventorydays = purchaseDate => {
    const startDate = new Date(purchaseDate)

    const currentDate = new Date()

    function difference(date1, date2) {
      const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
      const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())
      const day = 1000 * 60 * 60 * 24

      return (date2utc - date1utc) / day
    }

    setInventory(difference(startDate, currentDate))
  }

  //S3 bucket
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3M5KYLGFMAZJVYNU',
    secretAccessKey: '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',
    region: 'sa-east-1'
  })

  const handleFileChange = async event => {
    saveLoadings(true)
    setSelectedFile(event.target.files[0])
    await handleUpload(event.target.files[0])
    saveLoadings(false)
  }

  const handleUpload = file => {
    const params = {
      Bucket: 'carventure-bucket-prod',
      Key: file.name,
      Body: file,
      ACL: 'public-read'
    }

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(95, err.message)
      } else {
        //console.log(data.Location)
        setValue('image', data.Location)
      }
    })
  }

  async function onSubmitHandler(data) {
    try {
      saveLoadings(true)
      handleAddCar(data)
    } catch (e) {
      //añadido COMENTAR DESCOMENTAR ?
      saveLoadings(false)

      //toast.error(e.massage)
      //hastaaca COMENTAR DESCOMENTAR ?
    }
  }

  const brandModelVersion = async () => {
    const response = await getbrandModel()
    setbrandmodel(response)
    saveLoadings(false)
  }

  useEffect(() => {
    saveLoadings(true)
    brandModelVersion()
  }, [])

  const handleAddCar = async data => {
    const datas = users?.data?._id

    const response = await addNewCar({ data: { ...data, user: datas }, token })
    saveLoadings(true)
    if (response.statusCode === 200) {
      toast.success(response.massage)
      router.push('/car/all')
      saveLoadings(false)
    } else {
      toast.error(response.massage)
      saveLoadings(false)
    }
  }

  const sortBrand = (a, b) => {
    if (!a?.brand || !b?.brand) {
      return
    }

    return a.brand.localeCompare(b.brand)
  }

  const sortModel = (a, b) => {
    if (!a?.model || !b?.model) {
      return
    }

    return a.model.localeCompare(b.model)
  }

  const sortVersion = (a, b) => {
    if (!a?.version || !b?.version) {
      return
    }

    return a.version.localeCompare(b.version)
  }

  const CustomInput = forwardRef((props, ref) => {
    return (
      <TextField
        error={Boolean(errors.year)}
        helperText={Boolean(errors.year) && errors[`${props.fieldname}`]?.message}
        fullWidth
        type='text'
        {...props}
        autoComplete='off'
      />
    )
  })

  return (
    <Card>
      <CardHeader title={'Nuevo Auto'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Detalles del Auto
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={'Patente'}
                {...register('license_number')}
                error={Boolean(errors.license_number)}
                helperText={Boolean(errors.license_number) && errors.license_number.message}
                placeholder='ASD123ADWE'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={brandmodel.sort(sortBrand)}
                getOptionLabel={option => option.brand}
                onChange={(e, value) => {
                  setModelData(Object.keys(value.models))
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.brand)}
                    helperText={Boolean(errors.brand) && errors.brand.message}
                    {...register('brand')}
                    label={'Marca'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={modelData.sort(sortModel)}
                onChange={(e, value) => {
                  setVersionData(brandmodel.find(item => item.brand === watch('brand'))?.models[value])
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.model)}
                    helperText={Boolean(errors.model) && errors.model.message}
                    {...register('model')}
                    label={'Modelo'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={versionData.sort(sortVersion)}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.version)}
                    helperText={Boolean(errors.version) && errors.version.message}
                    {...register('version')}
                    label={'Versión'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={date}
                placeholderText='YYYY'
                dateFormat='yyyy'
                showYearPicker
                customInput={
                  <CustomInput
                    fieldname={'Year'}
                    label={'Año'}
                    error={Boolean(errors.Year)}
                    helperText={Boolean(errors.Year) && errors.Year.message}
                  />
                }
                id='form-layouts-separator-date'
                onChange={date => {
                  setValue('Year', date.getFullYear())
                  setDate(date)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                {...register('millage')}
                error={Boolean(errors.millage)}
                helperText={Boolean(errors.millage) && errors.millage.message}
                type='number'
                label={'Kilometraje'}
                placeholder='60'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={'Precio de compra'}
                type='number'
                {...register('purchase_price')}
                error={Boolean(errors.purchase_price)}
                helperText={Boolean(errors.purchase_price) && errors.purchase_price.message}
                placeholder='20000'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={purchaseDate}
                placeholderText='DD/MM/YYYY'
                dateFormat={'MM/dd/yyyy'}
                customInput={
                  <CustomInput value={watch('purchase_date')} fieldname={'purchase_date'} label={'Fecha de compra'} />
                }
                onChange={date => {
                  setValue('purchase_date', date.toDateString())
                  setPurchaseDate(date)
                  inventorydays(date.toDateString())
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                error={Boolean(errors.image)}
                InputLabelProps={{ shrink: true }}
                helperText={Boolean(errors.image) && errors.image.message}
                type='file'
                label={'Imagen'}
                onChange={handleFileChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                style={{ display: 'none' }}
                {...register('inventory')}
                type='number'
                label={'Inventario'}
                value={inventory}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Cargos
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              {fields.map((field, i) => (
                <Box key={i} mt={5} display='flex' alignItems='center' mb={2}>
                  <Grid container columnSpacing={5} rowSpacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        disablePortal
                        id='combo-box-demo'
                        options={[
                          { label: 'DyP', value: 'DyP' },
                          { label: 'Vidrio', value: 'Vidrio' },
                          { label: 'Neumáticos', value: 'Neumáticos' },
                          { label: 'Arreglo mecánico', value: 'Arreglo mecánico' },
                          { label: 'Arreglo eléctrico', value: 'Arreglo eléctrico' }
                        ]}
                        getOptionLabel={option => option.label}
                        onChange={(e, val) => setValue(`charges_items.${i}.name`, val?.value)}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={Boolean(errors.charges_items?.[i]?.name)}
                            helperText={
                              Boolean(errors.charges_items?.[i]?.name) && errors.charges_items?.[i]?.name.message
                            }
                            label={'Nombre'}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        type='number'
                        label={'Precio'}
                        {...register(`charges_items.${i}.price`)}
                        error={Boolean(errors.charges_items?.[i]?.price)}
                        helperText={
                          Boolean(errors.charges_items?.[i]?.price) && errors.charges_items?.[i]?.price.message
                        }
                        variant='outlined'
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        selected={
                          watch(`charges_items.${i}.charge_date`)
                            ? new Date(watch(`charges_items.${i}.charge_date`))
                            : null
                        }
                        placeholderText='DD/MM/YYYY'
                        dateFormat={'MM/dd/yyyy'}
                        customInput={
                          <CustomInput value={'charge_date'} fieldname={'charge_date'} label={'Fecha de cargo'} />
                        }
                        onChange={date => {
                          setValue(`charges_items.${i}.charge_date`, date.toDateString())
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      {fields.length > 0 && (
                        <Button variant='outlined' color='error' onClick={() => handleRemoveChargeItem(i)}>
                          Quitar
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button sx={{ mt: 5 }} variant='contained' color='primary' onClick={handleAddChargeItem}>
                Agregar Cargos
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type={'submit'} sx={{ mr: 2 }} variant='contained'>
            Guardar
          </Button>
          <Button size='large' color='secondary' variant='outlined'>
            Cancelar
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddCarForm
