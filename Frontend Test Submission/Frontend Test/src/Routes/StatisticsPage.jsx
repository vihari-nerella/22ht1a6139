// routes/StatisticsPage.jsx
import React, { useState, useEffect } from 'react';
import { getLinks, saveLinks } from '../utils/storage';
import {
  Typography, Accordion, AccordionSummary, AccordionDetails, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody, Paper, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLogging } from '../middleware/LoggingProvider';

const StatisticsPage = () => {
  const [links, setLinks] = useState([]);
  const { logs, clearLogs } = useLogging();

  useEffect(() => {
    setLinks(getLinks());
  }, []);

  const clearAllData = () => {
    saveLinks([]);
    setLinks([]);
    clearLogs();
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>URL Statistics</Typography>
      <Button variant="outlined" color="error" onClick={clearAllData} sx={{ mb: 2 }}>
        Clear all storage & logs
      </Button>

      {links.length === 0 && <Typography>No shortened links yet in this browser/session.</Typography>}

      {links.map(link => (
        <Accordion key={link.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '50%', flexShrink: 0 }}>{link.shortcode}</Typography>
            <Typography color="text.secondary">{link.originalUrl}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Created: {new Date(link.createdAt).toLocaleString()}</Typography>
            <Typography>Expires: {new Date(link.expiresAt).toLocaleString()}</Typography>
            <Typography>Click count: {link.clicks?.length ?? 0}</Typography>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer / Origin</TableCell>
                    <TableCell>User Agent</TableCell>
                    <TableCell>Geo (lat, lon)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(link.clicks || []).slice().reverse().map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(c.ts).toLocaleString()}</TableCell>
                      <TableCell>{c.referrer || 'direct'}</TableCell>
                      <TableCell style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.userAgent}</TableCell>
                      <TableCell>{c.geo?.lat ? `${c.geo.lat.toFixed(3)}, ${c.geo.lon.toFixed(3)}` : (c.geo === 'denied' ? 'permission denied' : 'unavailable')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      <Typography variant="h6" sx={{ mt: 3 }}>Application Logs</Typography>
      <Paper sx={{ p: 2, mt: 1 }}>
        {logs.length === 0 && <Typography>No logs yet.</Typography>}
        {logs.map(l => (
          <div key={l.id}>
            <Typography variant="caption">{new Date(l.ts).toLocaleString()} — {l.level.toUpperCase()}</Typography>
            <Typography variant="body2">{l.message}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{JSON.stringify(l.meta)}</Typography>
            <hr />
          </div>
        ))}
      </Paper>
    </div>
  );
};

export default StatisticsPage;