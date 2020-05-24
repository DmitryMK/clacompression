import React, { useState } from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// URL of the CLA Mirror server
// Example value: const claMirrorUrl = 'http://localhost:4600';
const claMirrorUrl = '';
// Number of times endpoints are repeated
const repeats = 6;

const TallLinearProgress = withStyles({
    root: {
        height: 30,
        backgroundColor: lighten('#556cd6', 0.5),
    },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

const getTrafficStats = (traffic, format = 'char') => {
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];

    if (format === 'num') {
        return traffic;
    } else {
        let i = -1;
        do {
            traffic = traffic / 1024;
            i++;
        } while (traffic > 1024);

        if (traffic === 0) {
            return '0 bytes';
        } else {
            return Math.max(traffic, 0.1).toFixed(1) + byteUnits[i];
        }
    }
};

/*
    *** Large ***
    'mdr/cdashig/2-1',
    'mdr/sdtm/1-7',
    'mdr/sdtmig/3-1-2',
    'mdr/ct/packages/sendct-2015-06-26',
    'mdr/ct/packages/cdashct-2019-06-28',
    'mdr/ct/packages/sdtmct-2018-09-28',
    *** Medium ***
    'mdr/sdtmig/3-3/datasets/DM',
    'mdr/sdtmig/3-3/datasets/CO',
    'mdr/sdtmig/3-3/datasets/DS',
    'mdr/ct/packages/sdtmct-2018-09-28/codelists/C66781',
    'mdr/ct/packages/sendct-2015-09-25/codelists/C67154',
    'mdr/ct/packages/adamct-2014-09-26/codelists/C81224',
    *** Small ***
    'mdr/sdtmig/3-3/datasets/DM/variables/USUBJID',
    'mdr/sdtmig/3-3/datasets/DM/variables/STUDYID',
    'mdr/sdtmig/3-3/datasets/MB/variables/MBSEQ',
    'mdr/ct/packages/adamct-2018-12-21/codelists/C117745/terms/C98772',
    'mdr/ct/packages/adamct-2014-09-26/codelists/C81224/terms/C92226',
    'mdr/ct/packages/adamct-2017-09-29/codelists/C81224/terms/C132341',
*/
const endPointsSource = [
    'mdr/cdashig/2-1',
    'mdr/sdtm/1-7',
    'mdr/sdtmig/3-1-2',
    'mdr/ct/packages/sendct-2015-06-26',
    'mdr/ct/packages/cdashct-2019-06-28',
    'mdr/ct/packages/sdtmct-2018-09-28',
    'mdr/sdtmig/3-3/datasets/DM',
    'mdr/sdtmig/3-3/datasets/CO',
    'mdr/sdtmig/3-3/datasets/DS',
    'mdr/ct/packages/sdtmct-2018-09-28/codelists/C66781',
    'mdr/ct/packages/sendct-2015-09-25/codelists/C67154',
    'mdr/ct/packages/adamct-2014-09-26/codelists/C81224',
    'mdr/sdtmig/3-3/datasets/DM/variables/USUBJID',
    'mdr/sdtmig/3-3/datasets/DM/variables/STUDYID',
    'mdr/sdtmig/3-3/datasets/MB/variables/MBSEQ',
    'mdr/ct/packages/adamct-2018-12-21/codelists/C117745/terms/C98772',
    'mdr/ct/packages/adamct-2014-09-26/codelists/C81224/terms/C92226',
    'mdr/ct/packages/adamct-2017-09-29/codelists/C81224/terms/C132341',
];

let endPoints = [];
for (let i = 0; i < repeats; i++) {
    endPoints = endPoints.concat(endPointsSource);
}

export default function CustomizedProgressBars() {
    const classes = useStyles();

    const [ progress, setProgress ] = useState(0);
    const [ status, setStatus ] = useState({
        claMirror: '',
        claMirrorCompression: '',
    });
    const [ time, setTime ] = useState({
        claMirror: -1,
        claMirrorCompression: -1,
    });

    const runRequests = async (type) => {
        setProgress(0);
        let baseUrl;
        let options = {};
        if (type === 'claMirror') {
            baseUrl = claMirrorUrl + '/api/';
            options = {
                cache: 'no-cache',
                headers: {
                    'x-no-compression': true
                }
            };
        } else if (type === 'claMirrorCompression') {
            baseUrl = claMirrorUrl + '/api/';
            options = {
                cache: 'no-cache',
                headers: {
                    'Accept-Encoding': 'gzip'
                }
            };
        }
        let traffic = 0;
        let startTime = performance.now();
        let finished = 0;

        for (let i = 0; i < endPoints.length; i++) {
            const endPoint = endPoints[i];
            setStatus({ ...status, [type]: 'Fetching ' + endPoint });
            const response = await fetch(baseUrl + endPoint, options);
            if (response.ok) {
                finished++;
                traffic = traffic + (await response.arrayBuffer()).byteLength;
                setProgress(Math.ceil(((i + 1) / endPoints.length) * 100));
            }
        };
        let finishTime = performance.now();
        setTime({ ...time, [type]: finishTime - startTime});
        setStatus({ ...status, [type]: `Fetched ${finished} endpoints (${getTrafficStats(traffic)}) ${ type === 'claMirror' ? 'without compression' : 'with compression'}.` +
            ` Finished in ${Math.round((finishTime - startTime) / 10) / 100} seconds.`
        });
    }

    return (
        <div className={classes.root}>
            <TallLinearProgress
                variant='determinate'
                color='primary'
                value={progress}
            />
            <br/>
            <Grid container justify='center'>
                <Grid item>
                    <Button
                        onClick = {() => { runRequests('claMirror'); }}
                        variant = 'contained'
                        color = 'primary'
                        className = {classes.margin}
                    >
                        No Compression
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick = {() => { runRequests('claMirrorCompression'); }}
                        variant = 'contained'
                        color = 'primary'
                        className = {classes.margin}
                    >
                        Compression
                    </Button>
                </Grid>
            </Grid>
            {Object.values(status).map((text, index) => (
                <Typography variant='caption' key={index} gutterBottom>
                    {text}
                    <br/>
                </Typography>
            ))}
            { time.claMirrorCompression > 0 && time.claMirror > 0 && (
                <Typography variant='caption' gutterBottom>
                    Efficiency: { 100 - Math.round(time.claMirrorCompression / time.claMirror * 100)}%
                </Typography>
            )}
        </div>
    );
}
