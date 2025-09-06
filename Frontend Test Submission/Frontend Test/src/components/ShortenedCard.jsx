import React from 'react';
import { Card, CardContent, Typography, Link } from '@mui/material';

const ShortenedCard = ({ item }) => {
  const origin = window.location.origin;
  const shortUrl = `${origin}/${item.shortcode}`;

  const expiresAtText = item.expiresAt ? new Date(item.expiresAt).toLocaleString() : '—';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1">
          <Link href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</Link>
        </Typography>
        <Typography variant="body2">Original: {item.originalUrl}</Typography>
        <Typography variant="body2">Created: {new Date(item.createdAt).toLocaleString()}</Typography>
        <Typography variant="body2">Expires: {expiresAtText}</Typography>
        <Typography variant="body2">Clicks: {item.clicks?.length ?? 0}</Typography>
      </CardContent>
    </Card>
  );
};

export default ShortenedCard;
