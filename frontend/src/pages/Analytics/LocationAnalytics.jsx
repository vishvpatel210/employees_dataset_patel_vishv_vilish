import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { getCountryAnalysis, getStateAnalysis } from '../../services/analyticsService';

const LocationAnalytics = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [countryRes, stateRes] = await Promise.all([getCountryAnalysis(), getStateAnalysis()]);
        setCountries(
          (countryRes.data?.data ?? []).map((item) => ({
            name: item._id || 'Unknown',
            count: item.count,
          }))
        );
        setStates(
          (stateRes.data?.data ?? []).map((item) => ({
            name: item._id || 'Unknown',
            count: item.count,
          }))
        );
      } catch {
        setCountries([]);
        setStates([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          Location Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Employee distribution across countries and states
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 0 }}>
          {/* Countries */}
          <Box
            sx={{
              borderRight: { md: '1px solid' },
              borderBottom: { xs: '1px solid', md: 'none' },
              borderColor: 'divider',
            }}
          >
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                By Country
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Country
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }} align="right">
                      Employees
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {countries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary" variant="body2">
                          No data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    countries.slice(0, 10).map((row) => (
                      <TableRow key={row.name} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Typography variant="body2">{row.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={row.count}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, minWidth: 40 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* States */}
          <Box>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                By State
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      State
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }} align="right">
                      Employees
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {states.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary" variant="body2">
                          No data
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    states.slice(0, 10).map((row) => (
                      <TableRow key={row.name} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Typography variant="body2">{row.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={row.count}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ fontWeight: 600, minWidth: 40 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default LocationAnalytics;
