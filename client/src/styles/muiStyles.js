import { makeStyles } from '@material-ui/core/styles';


// Navbar Styles // 
export const useNavStyles = makeStyles(
    (theme) => ({
        leftPortion: {
            flexGrow: 1,
            display: 'flex',
            alighnItems: 'center',
            [theme.breakpoints.down('xs')]: {
                marginLeft: '1em',
            },
        },
        logoWrapper: {
            marginRight: theme.spacing(10),
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
        },
        logo: {
            fontSize: '1.3em',
            padding: '0.1em',
            marginRight: '0.3em',
            textTransform: 'none',
        },
        user: {
            marginRight: 10,
        },
        titleButton: {
            textTransform: 'none',
            marginRight: 12,
            fontSize: 19,
        },
        navButtons: {
            '&:hover': {
                backGroundColor: 'blue',
            },
        },
        search: {
            flexGrow: 0.75,
            [theme.breakpoints.down('sm')]: {
                flexGrow: 1,
                padding: '0 0.5em',
            },
        },
        searchBtn: {
            padding: '0.2em',
        },
    }),
    { index: 1 }
);

// UserMenu Styles // 
export const useUserMenuStyles = makeStyles(
    (theme) => ({
      userBtn: {
        textTransform: 'none',
        display: 'flex',
      },
      avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginRight: '0.1em',
        backgroundColor: theme.palette.secondary.main,
        [theme.breakpoints.up('xs')]: {
          marginRight: '0.5em',
        },
      },
      userBtnMob: {},
      navItems: {
        display: 'flex',
        alignItems: 'center',
      },
      karmaWrapper: {
        display: 'flex',
        alignItems: 'center',
      },
    }),
    { index: 1 }
  );
  