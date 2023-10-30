import { TabList } from '@mui/lab'
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'

import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ChargeCar from 'src/@core/components/car/ChargeCar'
import InspectionCar from 'src/@core/components/car/InspectionCar'
import PublishCar from 'src/@core/components/car/PublishCar'
import SellCar from 'src/@core/components/car/SellCar'
import TaskCar from 'src/@core/components/car/TaskCar'
import CommissionCar from 'src/@core/components/car/CommissionCar'
import TaskTable from 'src/@core/components/table/TaskTable'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { AccountContext } from 'src/service/Account'
import { addCommission, getSingleCars } from 'src/service/Car'

const CarDetail = ({ id }) => {
  const router = useRouter()
  const { users, saveUsers, saveLoadings, isLoading, t } = useContext(SettingsContext)
  const { signOut } = useContext(AccountContext)
  const [cardetail, setcardetail] = useState([])
  const [isSold, setIsSold] = useState(false)
  const [ispublish, setispublish] = useState(false)
  const [nextInspection, setnextInspection] = useState(false)
  const [addtask, setaddtask] = useState(false)
  const [addcommission, setaddcommission] = useState(false)
  const [addcharge, setaddcharge] = useState(false)

  const handlecardata = async () => {
    const token = users?.token
    const SinglecarData = await getSingleCars({ token, id })
    setcardetail(SinglecarData)
    saveLoadings(false)
    if (SinglecarData.massage === 'Token expired') {
      await signOut()
      saveUsers({})
      localStorage.clear()
      router.push('/login')
    }
  }
  useEffect(() => {
    saveLoadings(true)
    handlecardata()
  }, [users])

  const startDate = new Date(cardetail?.data?.purchase_date)
  const currentDate = new Date()

  function difference(date1, date2) {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())
    const day = 1000 * 60 * 60 * 24

    return (date2utc - date1utc) / day
  }

  const inventorydays = difference(startDate, currentDate)

  const formatNumberWithDots = number => {
    if (typeof number !== 'number') {
      return number // Return as is if it's not a valid number
    }

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <>
      <Card>
        {!isLoading && (
          <CardContent>
            <Grid container spacing={4} sx={{ padding: '12px' }}>
              <Grid item xs={12} mt={4}>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  {'Detalles del auto'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <img
                  src={
                    cardetail?.data?.image
                      ? cardetail?.data?.image
                      : 'https://car-dealer-uat.s3.sa-east-1.amazonaws.com/dummy.jpg'
                  }
                  width={'80%'}
                  height={'auto'}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={8} sx={{ padding: '10px' }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    {'Patente : '}
                    <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.license_number}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Marca'} : <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.brand}</span>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {'Modelo'} : <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.model}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Versión'} : <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.version}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Año'} : <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.Year}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Kilometraje'} : <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.millage}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Precio de compra'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>{formatNumberWithDots(cardetail?.data?.purchase_price)}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Fecha de compra'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>
                      {new Date(cardetail?.data?.purchase_date).toLocaleDateString('es', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </Grid>
                  {cardetail?.data?.status !== 'Sold' && (
                    <Grid item xs={12} sm={6}>
                      {'Inventario'} : <span style={{ color: '#e7e3fcad' }}>{inventorydays}</span>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    {'Monto de cargos'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>{formatNumberWithDots(cardetail?.data?.charges_amount)}</span>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {'Estado'} : <span style={{ color: '#e7e3fcad' }}>{t(cardetail?.data?.status)}</span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {cardetail?.data?.charges_items?.length === 0 ? null : (
              <Grid container mt={2} spacing={4} sx={{ padding: '12px' }}>
                <Grid item xs={12}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {'Cargos'} <span style={{ color: '#e7e3fcad' }}></span>
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  {cardetail?.data?.charges_items?.map((item, index) => (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        {'Nombre'} : {item?.name}
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        {' '}
                        {'Precio'} : {formatNumberWithDots(item?.price)}
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        {' '}
                        {'Fecha'} :{' '}
                        <span style={{ color: '#e7e3fcad' }}>
                          {new Date(item?.charge_date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            {cardetail?.data?.status === 'Sold' &&
              (cardetail?.data?.payment_method?.[0]?.price == null ? null : (
                <Grid container mt={2} spacing={4} sx={{ padding: '12px' }}>
                  <Grid item xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {'Tipo de pago'} <span style={{ color: '#e7e3fcad' }}></span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    {cardetail?.data?.payment_method?.map((item, index) => (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          {'Tipo'} : {item?.type}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          {'Precio'} : {formatNumberWithDots(item?.price)}
                        </Grid>
                        {item?.type == 'Financiamiento' && (
                          <Grid item xs={12} sm={6} md={4}>
                            {'Empresa'} : {item?.company}
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            {cardetail?.data?.status === 'Sold' &&
              (cardetail?.data?.commission_items?.[0]?.price == null ? null : (
                <Grid container mt={2} spacing={4} sx={{ padding: '12px' }}>
                  <Grid item xs={12}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {'Comision'} <span style={{ color: '#e7e3fcad' }}></span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    {cardetail?.data?.commission_items?.map((item, index) => (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          {'Tipo de ingreso'} : {item?.type}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          {'Precio'} : {formatNumberWithDots(item?.price)}
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          {'Empresa'} : {item?.company}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            {(cardetail?.data?.status === 'Publish' || cardetail?.data?.status === 'Sold') &&
              cardetail?.data?.publish_date !== null && (
                <Grid container spacing={4} sx={{ padding: '12px' }}>
                  <Grid item xs={12} mt={4}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {'Detalles publicación'}
                    </Typography>
                  </Grid>

                  {cardetail?.data?.publish_date && (
                    <Grid item xs={12} sm={6} md={4}>
                      {'Fecha publicación'} :{' '}
                      <span style={{ color: '#e7e3fcad' }}>
                        {new Date(cardetail?.data?.publish_date).toLocaleDateString('es', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </Grid>
                  )}
                  {cardetail?.data?.inspection_date && (
                    <Grid item xs={12} sm={6} md={4}>
                      {'Fecha inspección'} :{' '}
                      <span style={{ color: '#e7e3fcad' }}>
                        {new Date(cardetail?.data?.inspection_date).toLocaleDateString('es', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </Grid>
                  )}
                  {cardetail?.data?.published_price && (
                    <Grid item xs={12} sm={6} md={4}>
                      {'Precio publicado'} :{' '}
                      <span style={{ color: '#e7e3fcad' }}>
                        {formatNumberWithDots(cardetail?.data?.published_price)}
                      </span>
                    </Grid>
                  )}
                </Grid>
              )}
            {cardetail?.data?.status === 'Sold' && (
              <Grid container spacing={4} sx={{ padding: '12px' }}>
                <Grid item xs={12} mt={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {'Detalle Venta'}
                  </Typography>
                </Grid>
                {cardetail?.data?.sell_date && (
                  <Grid item xs={12} sm={6} md={4}>
                    {'Fecha de venta'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>
                      {new Date(cardetail?.data?.sell_date).toLocaleDateString('es', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </Grid>
                )}
                {cardetail?.data?.sell_executive && (
                  <Grid item xs={12} sm={6} md={4}>
                    {'Ejecutivo de venta'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>{cardetail?.data?.sell_executive}</span>
                  </Grid>
                )}
                {cardetail?.data?.selling_price && (
                  <Grid item xs={12} sm={6} md={4}>
                    {'Precio de venta'} :{' '}
                    <span style={{ color: '#e7e3fcad' }}>{formatNumberWithDots(cardetail?.data?.selling_price)}</span>
                  </Grid>
                )}
              </Grid>
            )}
            {cardetail?.data?.tasks.length > 0 && (
              <Grid container spacing={4} sx={{ padding: '12px' }}>
                <Grid item xs={12} mt={4}>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>
                    {'Detalle tareas'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TaskTable taskdetail={cardetail?.data} />
                </Grid>
              </Grid>
            )}
          </CardContent>
        )}
      </Card>
      <Box
        sx={{
          display:
            !ispublish && !isSold && !nextInspection && !addtask && !addcharge && addCommission ? 'flex' : 'block'
        }}
      >
        {cardetail?.data?.status !== 'Publish' &&
          cardetail?.data?.status !== 'Sold' &&
          !ispublish &&
          !addtask &&
          !nextInspection &&
          !isSold &&
          !addcharge && (
            <Grid mt={5}>
              <Button
                onClick={e => {
                  setispublish(true)
                }}
                variant='contained'
              >
                {'Publicar Auto'}
              </Button>
            </Grid>
          )}{' '}
        {ispublish && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <PublishCar id={id} setispublish={setispublish} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
        {cardetail?.data?.status !== 'Sold' && !addcharge && !isSold && !nextInspection && !addtask && !ispublish && (
          <Grid mt={5} ml={4}>
            <Button
              onClick={e => {
                setaddcharge(true)
              }}
              variant='contained'
            >
              {'Añadir cargos'}
            </Button>
          </Grid>
        )}{' '}
        {addcharge && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <ChargeCar id={id} setaddcharge={setaddcharge} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
        {cardetail?.data?.status !== 'Sold' &&
          cardetail?.data?.status !== 'New Car' &&
          !isSold &&
          !nextInspection &&
          !addtask &&
          !addcharge &&
          !ispublish && (
            <Grid mt={5} ml={4}>
              <Button
                onClick={e => {
                  setIsSold(true)
                }}
                variant='contained'
              >
                {'Vender auto'}
              </Button>
            </Grid>
          )}
        {isSold && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <SellCar id={id} setIsSold={setIsSold} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
        {cardetail?.data?.status === 'Publish' && !nextInspection && !addtask && !isSold && !addcharge && (
          <Grid mt={5} ml={4}>
            <Button
              onClick={e => {
                setnextInspection(true)
              }}
              variant='contained'
            >
              {'Próxima inspección'}
            </Button>
          </Grid>
        )}
        {nextInspection && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <InspectionCar id={id} setnextInspection={setnextInspection} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
        {!addtask && !addcommission && !nextInspection && !isSold && !addcharge && !ispublish && (
          <Grid mt={5} ml={4}>
            <Button
              onClick={e => {
                setaddtask(true)
              }}
              variant='contained'
            >
              {'Añadir Tarea'}
            </Button>
          </Grid>
        )}
        {addtask && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <TaskCar id={id} setaddtask={setaddtask} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
        {cardetail?.data?.status == 'Sold' && !addcommission && !addtask && (
          <Grid mt={5} ml={4}>
            <Button
              onClick={e => {
                setaddcommission(true)
              }}
              variant='contained'
            >
              {'Añadir Comision'}
            </Button>
          </Grid>
        )}
        {cardetail?.data?.status == 'Sold' && addcommission && (
          <Grid container mt={4} spacing={4}>
            <Grid item xs={12}>
              <CommissionCar id={id} setaddcommission={setaddcommission} handlecardata={handlecardata} />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  )
}

export const getServerSideProps = ctx => {
  const id = ctx.params.id

  return {
    props: {
      id
    }
  }
}

export default CarDetail
