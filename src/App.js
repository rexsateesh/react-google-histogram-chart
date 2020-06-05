import React, { useState } from 'react';
import './App.css';
import Histogram from './components/Histogram';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';

// Generate styles
const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  heroButtons: {
    marginTop: theme.spacing(1),
  },
}));

// Charts configuration
const chart = {
  post: {
    heading: 'Posts',
    title: 'Posts word count',
    subtitle: 'This chart generate based on content\'s word counts',
    slab: 500,
    range: 5000,
    url: 'https://www.vdocipher.com/blog/wp-json/wp/v2/posts?per_page=100'
  },
  page: {
    heading: 'Pages',
    title: 'Pages word count',
    subtitle: 'This chart generate based on content\'s word counts',
    slab: 100,
    range: 2000,
    url: 'https://www.vdocipher.com/blog/wp-json/wp/v2/pages?per_page=100'
  }
}

const setPostSlab = val => chart.post.slab = val; // Set post slab on slider
const setPageSlab = val => chart.page.slab = val; // Set page slab on slider

function App() {
  const classes = useStyles(); // Creating styles object
  const [generateReport, setGenerateReport] = useState(false); // Creating state to manage generate report state
  
  return (
    <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                VdoCipher
              </Typography>
            </Toolbar>
        </AppBar>

        <div className={classes.heroContent}>
          <Container maxWidth="md">
            <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
              Words Count Report
            </Typography>
            {!generateReport && <div className={classes.heroButtons}>
              <Container maxWidth="xs">
                <Typography gutterBottom>Posts Slabs</Typography>
                <Slider
                  defaultValue={chart.post.slab}
                  getAriaValueText={setPostSlab}
                  valueLabelDisplay="auto"
                  step={500}
                  marks
                  min={0}
                  max={5000}
                />
              </Container>
              
              <Container maxWidth="xs">
                <Typography gutterBottom>Pages Slabs</Typography>
                <Slider
                  defaultValue={chart.page.slab}
                  getAriaValueText={setPageSlab}
                  valueLabelDisplay="auto"
                  step={100}
                  marks
                  min={0}
                  max={2000}
                />
              </Container>

              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setGenerateReport(true)}>Generate Report</Button>
                </Grid>
              </Grid>
            </div>}
          </Container>
        </div>

        {generateReport && <div className="App">
            <Histogram {...chart.post} />
            <Histogram {...chart.page} />
        </div>}
      </React.Fragment>
  );
}

export default App;
