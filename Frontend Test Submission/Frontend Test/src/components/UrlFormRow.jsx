import React from "react";
import {TextField, Grid} from "@mui/material";

const UrlFormRow = ({index,row,onChange,error}) =>{
    return(
        <Grid container spacing={2} alignItems="center" sx={{mb:1}}>
            <Grid item xs={12} md={6}>
            <TextField
                label={`Original URL ${index + 1}`} fullWidth value={row.originalUrl}
                onChange={(e) => onChange(index, {...row,originalUrl : e.target.value})}
                error={!!error?.originalUrl}
                helpertext = {error?.originalUrl}/>
            </Grid>
            <Grid item xs={6} md={3}>
            <TextField
            label="Validity (minutes)"
            type="number"
            fullWidth
            value={row.validityMinutes ?? ''}
            onChange={(e) => onChange(index, { ...row, validityMinutes: e.target.value })}
            error={!!error?.validityMinutes}
            helperText={error?.validityMinutes || 'defaults to 30'}
            />
            </Grid>
            <Grid item xs={6} md={3}>
            <TextField
            label="Custom shortcode (optional)"
            fullWidth
            value={row.customShortcode ?? ''}
            onChange={(e) => onChange(index, { ...row, customShortcode: e.target.value })}
            error={!!error?.customShortcode}
            helperText={error?.customShortcode || '4-12 alphanumeric'}
            />
            </Grid>
            </Grid>

            )
}
export default UrlFormRow;