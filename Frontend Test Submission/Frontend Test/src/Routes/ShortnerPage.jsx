import React, { useState } from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import UrlFormRow from '../components/UrlFormRow';
import ShortenedCard from '../components/ShortenedCard';
import { getLinks, saveLinks } from '../utils/storage';
import { generateShortcode, isValidCustomShortcode } from '../utils/shortcode';
import { useLogging } from '../middleware/LoggingProvider';

const DEFAULT_MINUTES = 30;

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const ShortenerPage = () => {
  const [rows, setRows] = useState([{ originalUrl: '', validityMinutes: '', customShortcode: '' }]);
  const [errors, setErrors] = useState([{}]);
  const [results, setResults] = useState([]);
  const { log } = useLogging();

  const updateRow = (i, next) => {
    const copy = [...rows];
    copy[i] = next;
    setRows(copy);
 const errCopy = [...errors];
    errCopy[i] = {};
    setErrors(errCopy);
  };

  const addRow = () => {
    if (rows.length >= 5) return;
    setRows([...rows, { originalUrl: '', validityMinutes: '', customShortcode: '' }]);
    setErrors([...errors, {}]);
  };

  const validateAndCreate = () => {
    const errs = rows.map(() => ({}));
    let hasErr = false;
    const existing = getLinks();

    rows.forEach((r, idx) => {
      if (!r.originalUrl) {
        errs[idx].originalUrl = 'Required';
        hasErr = true;
        return;
      }
      if (!isValidUrl(r.originalUrl)) {
        errs[idx].originalUrl = 'Invalid URL (must include http/https)';
        hasErr = true;
      }
      if (r.validityMinutes) {
        const n = Number(r.validityMinutes);
        if (!Number.isInteger(n) || n <= 0) {
          errs[idx].validityMinutes = 'Must be a positive integer';
          hasErr = true;
        }
      }
      if (r.customShortcode) {
        if (!isValidCustomShortcode(r.customShortcode)) {
          errs[idx].customShortcode = '4-12 alphanumeric only';
          hasErr = true;
        } else if (existing.some(x => x.shortcode === r.customShortcode)) {
          errs[idx].customShortcode = 'Shortcode already taken';
          hasErr = true;
        }
      }
    });

    setErrors(errs);
    if (hasErr) {
      log('error', 'Validation failed when creating short links', { rows, errors: errs });
      return;
    }

    // create links
    const toCreate = rows.map(r => {
      const createdAt = Date.now();
      const minutes = r.validityMinutes ? Number(r.validityMinutes) : DEFAULT_MINUTES;
      const expiresAt = createdAt + minutes * 60 * 1000;
      const shortcode = r.customShortcode ? r.customShortcode : generateShortcode();
      return {
        id: `${shortcode}_${createdAt}`,
        shortcode,
        originalUrl: r.originalUrl,
        createdAt,
        expiresAt,
        clicks: []
      };
    });
    const newLinks = [...existing, ...toCreate];
    saveLinks(newLinks);
    setResults(toCreate);
    // reset form to one empty row
    setRows([{ originalUrl: '', validityMinutes: '', customShortcode: '' }]);
    setErrors([{}]);

    log('event', 'Short links created', { createdCount: toCreate.length, shortcodes: toCreate.map(t => t.shortcode) });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>URL Shortener</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        You can shorten up to 5 URLs at once. If validity is empty, defaults to 30 minutes.
      </Typography>

      {rows.map((row, idx) => (
        <UrlFormRow key={idx} index={idx} row={row} onChange={updateRow} error={errors[idx] || {}} />
      ))}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={validateAndCreate}>Create Short Links</Button>
        <Button variant="outlined" onClick={addRow} disabled={rows.length >= 5}>Add row</Button>
      </Box>

      <Divider sx={{ my: 2 }} />
 {results.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Created</Typography>
          {results.map(r => <ShortenedCard key={r.id} item={r} />)}
        </>
      )}
    </Box>
  );
};

export default ShortenerPage;


