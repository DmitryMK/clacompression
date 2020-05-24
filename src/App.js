import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ClaTest from './claTest';

export default function App() {
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" align='center' gutterBottom>
                CLA Mirror Compression Test
            </Typography>
            <ClaTest />
        </Container>
    );
}
