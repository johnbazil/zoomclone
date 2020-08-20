import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Switch, FormControl, InputLabel, Input } from '@material-ui/core';

const styles = (theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
})

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: '',
                password: '',
            },
            formErrorMessage: {
                email: '',
                password: ''
            },
            formValid: {
                email: false,
                password: false,
                buttonActive: false
            },
            successMessage: '',
            errorMessage: '',
            loadRegister: false,
            spin: true,
        }
    }
    Copyright = () => {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Your Website
        </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ form: { ...this.state.form, [name]: value } });
        this.validateField(name, value)
    }
    validateField = (name, value) => {
        var message;
        var { formErrorMessage } = this.state;
        var { formValid } = this.state;
        switch (name) {
            case 'email':
                let emailRegex = new RegExp(/^[A-z][A-z0-9.]+@[a-z]+\.[a-z]{2,3}$/)
                value === "" ? message = "Please enter your email Id" : emailRegex.test(value) ? message = '' : message = 'Invalid Email ID';
                break;
            case 'password':
                let passwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$/);
                value === "" ? message = "Please enter your password" : passwordRegex.test(value) ? message = '' : message = 'Invalid password';
                break;
            default:
                break;
        }
        formErrorMessage[name] = message;
        message === '' ? formValid[name] = true : formValid[name] = false;
        formValid.buttonActive = formValid.email && formValid.password;
        this.setState({ formErrorMessage: formErrorMessage, formValid: formValid })
    }

    submitSignIn = (e) => {
        e.preventDefault();
        const loginData = { email: this.state.form.email, password: this.state.form.password }
        axios.post('http://localhost:2000/login', loginData)
            .then(response => {
                sessionStorage.setItem('userId', response.data.userId);
                sessionStorage.setItem('userName', response.data.userName);
                this.setState({ successMessage: "Successfully logged in" })
            })
            .catch(error => {
                this.setState({ errorMessage: error.response ? error.response.data.message : error.message })
            })
    }

    render() {
        const { email, password } = this.state.form;
        const { formErrorMessage } = this.state;
        const { classes } = this.props;
        return (
            <div className="col-md-lg-4 offset-md-lg-4 col-xs-sm-12">
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login to continue
                        </Typography>
                        <form className={classes.form} onSubmit={this.submitSignIn} >
                            <FormControl margin='normal' required fullWidth>
                                <InputLabel htmlFor='email' >Email Address<span className='text-danger'>*</span></InputLabel>
                                <Input autoComplete='email' autoFocus
                                id='email' name='email' value={email} onChange={this.handleChange} />
                                <span className='text-danger'>{formErrorMessage.email}</span>
                            </FormControl>
                            <FormControl margin='normal' required fullWidth>
                                <InputLabel htmlFor='passord' >Password<span className='text-danger'>*</span></InputLabel>
                                <Input  type='password'
                                id='password' name='password' value={password} onChange={this.handleChange} />
                                <span className='text-danger'>{formErrorMessage.password}</span>
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        {this.Copyright}
                    </Box>
                </Container>
            </div>
        );
    }
}