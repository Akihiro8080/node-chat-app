import { Box, Stack, Typography ,TextField, Grid,Button} from '@mui/material'
import React from 'react'
import {createTheme } from '@mui/material/styles';
import styled from '@emotion/styled'
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../Features/userSlice';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';

const CustomBox = styled(Box)({
    marginTop:"70px",
    paddingTop:"50px",
    textAlign:"center",
    height:"100vh",
    backgroundColor:'#333132'
})

function Login() {
    const [username ,setusername] = useState("");
    const [password ,setpassword] = useState("");
    const dispatch = useDispatch();

    //配色
    const theme = createTheme({
        palette:{
            color:{
                main:"#0E2128",
                contrastText:"#f5f5f5"
            },
        },
    });

     //現在の文字数をカウントし、errorステートに登録 : 名前
     const handlenameChange = (username) =>{
        console.log(username)
        setusername(username);
    };

    //現在の文字数をカウントし、errorステートに登録 : パスワード
    const handlepasswordChange = (password) =>{
        console.log(password);
        setpassword(password);
    };

    const formSubmit = (formId) =>{
        const form = document.getElementById(formId);
        const arg = [form.action];

        if( form.method === undefined || form.method.toUpperCase() === "POST")
            arg.push({method:"POST",body:new FormData(form)} );
    
        return fetch( ...arg ).then( response => 
            response.status === 200 ? response.json() : Promise.reject(response.status).then(window.location.assign("/"))
        );
    }

    const handleSubmit = () => {
        formSubmit("user_login").then((value)=>{
            console.log(value)
            dispatch(login({
                name:value.username,
                id:value.id.toString(),
                loginfield:true,
            }))
        })
    }

  return (
    <CustomBox flex={5} p={1} sx={{ textAlign:"center"}}>
        <Typography variant='h5' fontWeight="fontWeightBold" sx={{color:"white"}}>
            LOGIN
        </Typography>
        <Typography variant='body2' fontWeight="fontWeightBold" sx={{mb:5,pt:5,color:"white"}}>
            ~ 世界中の仲間と新しいつながりを ~
        </Typography>
        <Box sx={{textAlign:"center"}}>
            <form id="user_login" action="/loginuser" method="POST">
                <Grid container rowSpacing={{xs:12}} p={2} sx={{textAlign:"center"}}>
                    <Grid item xs={12} sm={12} p={1} sx={{borderRadius:3,border:"1px solid #D3D3D3"}}>
                        <Stack direction={'column'} spacing={0} sx={{textAlign:'center'}}>
                            <Typography variant='caption' sx={{color:'white'}}><PersonIcon sx={{marginBottom:"-5px"}}/>ユーザネーム</Typography>
                            <TextField 
                                required
                                name='login_name'
                                inputProps={{maxLength:30}}
                                value={username}
                                style={{marginLeft:"15vw",marginRight:"15vw",color:"white"}}
                                onChange={(e)=>handlenameChange(e.target.value)}
                                autoComplete='off'
                            />
                            <Typography variant='caption'sx={{marginTop:"20px",color:'white'}}><PasswordIcon sx={{marginBottom:"-5px",marginRight:"3px"}}/>パスワード</Typography>
                            <TextField 
                                required
                                type='password'
                                name='login_password'
                                inputProps={{maxLength:30}}
                                value={password}
                                style={{marginLeft:"15vw",marginRight:"15vw"}}
                                onChange={(e)=>handlepasswordChange(e.target.value)}
                                autoComplete='off'
                            />
                        </Stack>
                    </Grid>
                </Grid>
                {username===""||password===""?
                    <Button disabled id="submit_login_btn" variant="contained" style={{marginBottom:"20px"}} onClick={handleSubmit}>Submit</Button>      
                :
                    <Button id="submit_login_btn" variant="contained" style={{marginBottom:"20px"}} onClick={handleSubmit}>Submit</Button>
                }
            </form>
            <Link to="/">Create New Account</Link>
        </Box>
    </CustomBox>
  )
}

export default Login