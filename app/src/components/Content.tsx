import * as React from 'react';
import { useState } from 'react';
import {
  AppBar,
  Box,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useDataProvider } from '@/hooks/useDataProvider';

export function Content() {
  const [text, setText] = useState('');

  const dataProvider = useDataProvider();

  const queries = dataProvider.getQueriesByAssistant(
    '6137a621-f3dc-410d-bb7f-6f8fa14fea27',
  );

  const historyText = queries
    .map(
      (query) => `Question: ${query.content} ~~~ Response: ${query.response}`,
    )
    .join('\n');

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit" component="div">
                GPTer
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', justifyContent: 'space-around' }}
      >
        <TextField
          sx={{ width: '80%' }}
          label="History"
          multiline
          rows={10}
          disabled
          defaultValue={historyText}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', justifyContent: 'space-around' }}
      >
        <TextField
          sx={{ width: '80%' }}
          onChange={onValueChange}
          label="Your text"
          variant="outlined"
          value={text}
        />
      </Grid>
    </Grid>
  );
}
