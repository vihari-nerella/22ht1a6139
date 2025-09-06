import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import ShortenerPage from './Routes/ShortnerPage';
import StatisticsPage from './Routes/StatisticsPage';
import RedirectHandler from './Routes/RedirectHandler';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AffordMed — URL Shortener
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">Shorten</Button>
          <Button color="inherit" component={RouterLink} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;