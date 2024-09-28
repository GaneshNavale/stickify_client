import React from 'react';
import {  Grid, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#f1f1f1', padding: '20px 0' }}>
            <Grid container spacing={2} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Main Fields */}
                <Grid item xs={8}>
                    <Grid container spacing={3}>
                        {/* Product Section */}
                        <Grid item xs={4}>
                            <Typography variant="h6">Product</Typography>
                            <Link href="#" underline="hover">Link1</Link><br />
                            <Link href="#" underline="hover">Link2</Link><br />
                            <Link href="#" underline="hover">Link3</Link><br />
                        </Grid>
                        {/* Company Section */}
                        <Grid item xs={4}>
                            <Typography variant="h6">Company</Typography>
                            <Link href="#" underline="hover">Link1</Link><br />
                            <Link href="#" underline="hover">Link2</Link><br />
                            <Link href="#" underline="hover">Link3</Link><br />
                        </Grid>
                        {/* Support Section */}
                        <Grid item xs={4}>
                            <Typography variant="h6">Support</Typography>
                            <Link href="#" underline="hover">Link1</Link><br />
                            <Link href="#" underline="hover">Link2</Link><br />
                            <Link href="#" underline="hover">Link3</Link><br />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Social Media Links Section */}
                <Grid item xs={4}>
                    <Typography variant="h6">Social Media Links</Typography>
                    <Link href="#" underline="hover">Facebook</Link><br />
                    <Link href="#" underline="hover">Twitter</Link><br />
                    <Link href="#" underline="hover">Instagram</Link><br />
                    <Link href="#" underline="hover">LinkedIn</Link><br />
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
