import {
  Divider,
  Card,
  Table,
  TableCell,
  TableContainer,
  Typography,
  CardContent,
  Box,
  TableBody,
  CardHeader,
  TableHead,
  TableRow,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  CircularProgress
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useEffect, useState } from 'react';

const TableCellComponent = ({ value, align = 'left' }) => {
  return (
    <TableCell>
      <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap align={align}>
        {value}
      </Typography>
    </TableCell>
  );
};

const TableComponent = ({ columns, rows, msg, search = false, loading = false }) => {
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  return loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Card>
      <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" gutterBottom>
            {msg[0]}
          </Typography>
          <Typography variant="subtitle2">{msg[1]}</Typography>
        </Box>
        {search && (
          <FormControl variant="outlined">
            <OutlinedInput
              type="text"
              placeholder={`Search key here...`}
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={(e) =>
                      setFilteredRows(rows.filter((row) => row.search.toLowerCase().includes(searchKey.toLowerCase())))
                    }
                  >
                    Search
                  </Button>
                </InputAdornment>
              }
              startAdornment={
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        )}
      </Box>
      <Divider />
      <CardContent>
        {filteredRows.length > 0 ? (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.label} style={column.style} align={column.align || 'left'}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow hover key={row.key} onClick={row.onClick}>
                      {row.cells}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <Typography variant="h4" gutterBottom>
            No Data to display
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const SubTableComponent = ({ columns, rows, title }) => {
  return rows.length === 0 ? (
    <Typography variant="h4" gutterBottom>
      No Data to display in {title}
    </Typography>
  ) : (
    <Card>
      <CardHeader title={title} style={{ textAlign: 'center' }} />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.label} style={column.style} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover key={row.key} onClick={row.onClick}>
                {row.cells}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export { TableCellComponent, TableComponent, SubTableComponent };
