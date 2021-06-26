import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Link, Button, useMediaQuery, IconButton, } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const Navbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useNavStyles();

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(notify(`/commander/${user.username} logged out`, 'success'));
    };

    return (
        <AppBar position="sticky" color="inherit" elevation={1}>
            <Toolbar disableGutters={isMobile}>
                {!searchOpen && (
                    <>
                    <div className={classes.leftPortion}>
                    <div className={classes.logoWrapper}>
                        <Button className={classes.logo} color="primary" component={RouterLink} to='/' size='large'>
                            Comandit || MTG Social
                        </Button>
                        <Typography variant="caption" color="secondary">
                            Built By ryanj_dev
                            <Link
                            href={'https://github.com/rjhelm'}
                            color="inherit"
                            target="_blank"
                            rel="noopener"
                            >
                                <strong>{` ryanj_dev`}</strong>
                            </Link>
                        </Typography>
                        </div>
                        {isMobile && <SearchBar />}
                    </div>
                    {isMobile ? (
                        <>
                        <IconButton color="primary" className={classes.searchBtn} onClick={() => setSearchOpen((prevState) => !prevState)}>
                            <SearchIcon />
                        </IconButton>
                        <MobileUserMenu user={user} handleLogout={handleLogout} />
                        </>
                    ) : (
                        <DesktopUserMenu user={user} handleLogout={handleLogout} />
                    )}
                    </>
                )}
                {searchOpen && isMobile && (
                    <SearchBar isMobile={true} setSearchOpen={setSearchOpen} />
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;