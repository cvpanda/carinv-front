import * as React from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/router'
import { CSVLink } from 'react-csv'
import { useContext } from 'react'
import { SettingsContext } from 'src/@core/context/settingsContext'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

const headCells = [
  {
    id: 'brand',
    numeric: false,
    disablePadding: true,
    label: 'Brand'
  },
  {
    id: 'model',
    numeric: true,
    disablePadding: false,
    label: 'Model'
  },
  {
    id: 'year',
    numeric: true,
    disablePadding: false,
    label: 'Year'
  },
  {
    id: 'millage',
    numeric: true,
    disablePadding: false,
    label: 'Millage'
  },
  {
    id: 'version',
    numeric: true,
    disablePadding: false,
    label: 'Version'
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status'
  }
]

function EnhancedTableHead(props) {
  const { t } = props

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} align={'center'} padding={headCell.disablePadding ? 'none' : 'normal'}>
            {t(headCell.label)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
}

function EnhancedTableToolbar(props) {
  const { numSelected, cars, t } = props

  const carData = cars.map(item => {
    return {
      'License plate': item.license_number,
      'Purchase date': item.purchase_date,
      'Publish date': item.publish_date,
      Brand: item.brand,
      Model: item.model,
      Version: item.version,
      Year: item.Year,
      Millage: item.millage,
      'Purchase car price': item.purchase_price,
      'Sell Car Price': item.selling_price,
      Status: item.status,
      'Next inspection date': item.inspection_date,
      'Foto principal': item.image,
      'Sell date': item.sell_date,
      'Published Price': item.published_price,
      Created: new Date(item.createdAt).toLocaleDateString(),
      Updated: new Date(item.updatedAt).toLocaleDateString(),
      Charges: item.charges_amount,
      'Sell executive': item.sell_executive,
      'Time on inventory': item.inventory,
      margin: item.margin
    }
  })

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      <Typography sx={{ ml: 3, flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
        {t('Cars')}
      </Typography>

      <Button sx={{ mr: 3, width: '100px' }} variant='contained'>
        <CSVLink filename={'TableContent.csv'} data={carData} style={{ color: 'white', textDecoration: 'none' }}>
          Exportar
        </CSVLink>
      </Button>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  cars: PropTypes.array,
  t: PropTypes.func
}

export default function EnhancedTable({ cars }) {
  const { t } = useContext(SettingsContext)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const router = useRouter()

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.name)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleClick = id => {
    router.push(`/car/${id}`)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = event => {
    setDense(event.target.checked)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cars.length) : 0

  const visibleRows = React.useMemo(
    () => cars && cars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, cars]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {cars === undefined ? (
          <>
            <Typography variant='h6' textAlign={'center'} color={'white'} p={5}>
              No Cars Available
            </Typography>
          </>
        ) : (
          <>
            <EnhancedTableToolbar t={t} numSelected={selected.length} cars={cars} />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={'medium'}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={cars.length}
                  t={t}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.name)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        onClick={() => handleClick(row._id)}
                        selected={isItemSelected}
                        sx={{ px: 10, cursor: 'pointer' }}
                      >
                        <TableCell component='th' id={labelId} scope='row' padding='none' align='center'>
                          {row.brand}
                        </TableCell>
                        <TableCell align='center'>{row.model}</TableCell>
                        <TableCell align='center'>{row.Year}</TableCell>
                        <TableCell align='center'>{row.millage}</TableCell>
                        <TableCell align='center'>{row.version}</TableCell>
                        <TableCell align='center'>
                          <Chip
                            label={t(row.status)}
                            color={{ 'New Car': 'primary', Publish: 'success', Sold: 'error' }[row.status]}
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              '& .MuiChip-label': { fontWeight: 500 }
                            }}
                          />{' '}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={cars.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  )
}
