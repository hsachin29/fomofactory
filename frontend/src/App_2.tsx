import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox,
  FormControlLabel, FormGroup, AppBar, Toolbar, IconButton, Tooltip, createTheme, ThemeProvider
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Delta {
  hour: number;
  day: number;
  week: number;
  month: number;
  quarter: number;
  year: number;
}

interface CryptoData {
  crypto: string;
  data: {
    rate: number;
    volume: number;
    cap: number;
    delta: Delta;
  };
  lastUpdated: string;
}

const useStyles = makeStyles({
  container: {
    marginTop: '20px',
  },
  table: {
    minWidth: 650,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  title: {
    flexGrow: 1,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  filterButton: {
    marginBottom: '20px',
  },
  filterIcon: {
    color: '#fff',
  },
  appBar: {
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogActions: {
    justifyContent: 'center',
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  const [prices, setPrices] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [availableCryptos, setAvailableCryptos] = useState<string[]>([]);

  // Function to fetch data and update state
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/prices');
      const data: CryptoData[] = await response.json();
      setPrices(data);
      setLoading(false);

      // Set available cryptos for filter modal
      const cryptos = data.map(price => price.crypto);
      setAvailableCryptos(cryptos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount and every 1 second
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle opening and closing of the filter modal
  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  // Handle crypto selection change
  const handleCryptoChange = (crypto: string) => {
    setSelectedCryptos(prevSelected =>
      prevSelected.includes(crypto)
        ? prevSelected.filter(c => c !== crypto)
        : [...prevSelected, crypto]
    );
  };

  // Handle select all change
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCryptos(availableCryptos);
    } else {
      setSelectedCryptos([]);
    }
  };

  // Check if all items are selected
  const allSelected = selectedCryptos.length === availableCryptos.length;

  // Filter prices based on selected cryptos
  const filteredPrices = selectedCryptos.length
    ? prices.filter(price => selectedCryptos.includes(price.crypto))
    : prices;

  if (loading) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>Crypto Prices</Typography>
          <Tooltip title="Filter Cryptocurrencies">
            <IconButton edge="end" color="inherit" onClick={handleFilterOpen}>
              <FilterListIcon className={classes.filterIcon} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="crypto prices table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.headerCell}>Crypto</TableCell>
                <TableCell className={classes.headerCell} align="right">Rate (USD)</TableCell>
                <TableCell className={classes.headerCell} align="right">Volume</TableCell>
                <TableCell className={classes.headerCell} align="right">Market Cap</TableCell>
                <TableCell className={classes.headerCell} align="right">Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrices.map((price, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{price.crypto}</TableCell>
                  <TableCell align="right">${price.data.rate.toFixed(2)}</TableCell>
                  <TableCell align="right">{price.data.volume.toLocaleString()}</TableCell>
                  <TableCell align="right">${price.data.cap.toLocaleString()}</TableCell>
                  <TableCell align="right">{new Date(price.lastUpdated).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={filterOpen} onClose={handleFilterClose}>
          <DialogTitle className={classes.dialogTitle}>Filter Cryptocurrencies</DialogTitle>
          <DialogContent>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    onChange={handleSelectAllChange}
                    name="selectAll"
                  />
                }
                label="Select All"
              />
              {availableCryptos.map((crypto, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedCryptos.includes(crypto)}
                      onChange={() => handleCryptoChange(crypto)}
                      name={crypto}
                    />
                  }
                  label={crypto}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={handleFilterClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default App;
