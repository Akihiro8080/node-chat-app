import React, { useState,useEffect, useRef,useSyncExternalStore} from 'react'
import styled from '@emotion/styled'
import { Box ,Stack,TextField,Button, Typography,Grid, IconButton,MenuItem,Menu, Container} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import io from 'socket.io-client'
import { ReactTyped } from 'react-typed'
import { useSelector } from 'react-redux';
import { selectUser } from '../Features/userSlice';
import SimpleBar from 'simplebar-react'
import RoomImageNav from './RoomImageNav';

const socket = io('http://localhost:8080')
const ROOMID = 1; //ルームIDを利用した操作のために定義

const StorageID = `${ROOMID}/MyStorage`

const CustomBox = styled(Box)({
    minWidth:"100%",
    border:"1px solid black",
    minHeight:"100vh",
    display:"flex",
    backgroundColor:'#333132'
})

const CustomSimpleBar = styled(SimpleBar)({
    height:"80vh",
    overflow:"hidden",
    overflow:"auto"
})

const ChatLogArea = styled(Box)({})

const morevertoption = [
    'クリップ',
    '非表示',
    'メッセージ送信者をミュート'
]

function ChatZone() {
    const user = useSelector(selectUser);
    const inputarea = useRef(null)
    const [message,setMessage] = useState("");
    const [index,setIndex] = useState(0);
    const [anchorEl,setamchorEl] = React.useState(null);
    const [savedata,setSavedata] = useState(localStorage.getItem(StorageID))
    const open = Boolean(anchorEl);

    //受信したメッセージリスト
    const [receivedmessage,settReceivedmessage] = useState([])
    //クリップしたデータリスト
    const [savedmessage,setSavedmessage] = useState([]);

    useEffect(() => {
        socket.on('chat_data',(data)=>{
            settReceivedmessage((state) => [
                ...state,
                {
                    counter : data.counter,
                    name: data.name,
                    message: data.message,
                    __createtime__: data.__createtime__,
                    iscreatemessage : data.iscreatemessage
                },
            ]);
        });
        const doc = document.documentElement;
        window.setTimeout(
            () => window.scroll(0,doc.scrollHeight-doc.clientHeight),
            50
        );

        return () => socket.off('chat_data');
    },[receivedmessage]);
    
    function formatedDateFromTimeStamp(timestamp){
        const date = new Date(timestamp);
        const hours = date.getHours().toLocaleString();
        const minutes = date.getMinutes().toLocaleString();
        return hours+':'+minutes;
    }

    const sendMessage = () => {
        socket.emit('send_message',{name:user.name,message,socketID:socket.id})
        setMessage("")
    }

    const handleOptionClick = (e) => {
        setamchorEl(e.currentTarget)
        var currentcounter = e.currentTarget.id
        for(var i=0;i<Object.keys(receivedmessage).length;i++){
            if(currentcounter === JSON.stringify(receivedmessage[i].counter)){
                setIndex(i)
                break;
            }
        }
    }
    const handleOptionClose = () =>{
        setamchorEl(null);
    }

    const deletelocalStorage = () => {
        localStorage.removeItem(StorageID);
        setSavedmessage([])
    }
    //オプションメニューの動作
    //クリップ
    const handleOptionClip = (e) => {
        handleClip();
        setamchorEl(null);
    }

    const handleClip = () => {
        setSavedmessage((state) => [
            ...state,
            {
                counter : receivedmessage[index].counter,
                name: receivedmessage[index].name,
                message: receivedmessage[index].message,
                __createtime__: receivedmessage[index].__createtime__,
                iscreatemessage : receivedmessage[index].iscreatemessage
            },
        ]);
    }

    useEffect(()=>{
        localStorage.setItem(StorageID,JSON.stringify(savedmessage));
    },[savedmessage])

    //非表示
    const handleOptionHidden = () => {
        setamchorEl(null);
    }
    //メッセージ送信者をミュート
    const handleOptionMute = () => {
        setamchorEl(null)
    }

    const subscribe = (callback) => {
        window.addEventListener('resize',callback)
        return () => window.removeEventListener('resize',callback);
    }

    const getWindowWidth = () => {
        const width = window.innerWidth;
        if(width>=900){
            return true;
        }
        return false;
    }

    const useWindowWidth = useSyncExternalStore(subscribe,getWindowWidth);

    //ローカルストレージの内容を監視
    const subscribelog = (callback) => {
        window.addEventListener('storage',callback);
        return () => window.removeEventListener('storage',callback)
    }

    const getStorageData = () => {
        const data = localStorage.getItem(StorageID)
        return data;
    }

    const useStorageData = useSyncExternalStore(subscribelog,getStorageData,()=> "");

    useEffect(()=>{
        console.log("データが更新されました")
    },[useStorageData])

    return (
        <>
            <CustomBox>
                <Stack direction={'column'} justifyContent={'space-between'} sx={{display:'flex',marginRight:'auto',marginLeft:'auto',width:'90%'}}>
                    <Grid container spacing={4} justifyContent={'space-around'}>
                        <Grid item xs={12} md={9}>
                            <RoomImageNav/>
                            <ChatLogArea sx={{mb:16,mt:2}}>
                                {receivedmessage.map((msg,i)=>(
                                    <>
                                        <Stack direction={'row'} key={i} >
                                            <Stack direction={'row'}>
                                                <Box>
                                                    {msg.iscreatemessage?
                                                        <AccountCircleIcon sx={{color:'white',mr:1,mb:-1,border:'2px solid green',borderRadius:'50%'}} fontSize='large'/>
                                                    :
                                                        <AccountCircleIcon sx={{color:'white',mr:1,mb:-1}} fontSize='large'/>    
                                                    }
                                                    <Typography variant='body2' sx={{color:"white",mb:1,mr:2}}>{formatedDateFromTimeStamp(msg.__createtime__)}</Typography>
                                                </Box>
                                                <IconButton sx={{ml:-2,mt:-6,color:'white'}}
                                                    id = {msg.counter}
                                                    name = 'option_button'
                                                    aria-label="more"
                                                    aria-controls={open ? 'menu' : undefined}
                                                    aria-expanded={open ? 'true' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={handleOptionClick}>
                                                    <MoreVertIcon sx={{color:"white"}}/>
                                                </IconButton>
                                                <Menu
                                                    name="option-menu"
                                                    MenuListProps={{
                                                    'aria-labelledby': 'button',
                                                    }}
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleOptionClose}
                                                    style={{
                                                        width:'35ch',
                                                    }}
                                                >
                                                    <MenuItem onClick={handleOptionClip}>{morevertoption[0]}</MenuItem>
                                                    <MenuItem onClick={() => handleOptionHidden(i)} >{morevertoption[1]}</MenuItem>
                                                    <MenuItem onClick={() => handleOptionMute(i)} >{morevertoption[2]}</MenuItem>
                                                </Menu>
                                            </Stack>
                                        <Stack direction={'column'}>
                                            <Typography sx={{color:'white',fontSize:13,mb:-0.5}}>{msg.name}</Typography>
                                            <ReactTyped strings={[msg.message]} typeSpeed={25} style={{color:'white',fontSize:18}} showCursor={false}></ReactTyped>
                                        </Stack>
                                        </Stack>
                                    </>
                                ))}
                            </ChatLogArea>
                        </Grid>
                        <Grid item xs={0} md={3} mt={3}>
                            {useWindowWidth&& 
                                <Box position={'fixed'} sx={{maxWidth:400,minWidth:400}}> 
                                    <Box display={'flex'} justifyContent={'space-around'}>
                                    <Typography sx={{color:'yellow'}}>データ一覧</Typography>
                                    <Button variant='contained' onClick={()=>deletelocalStorage()}>クリップ解除</Button>
                                    </Box>
                                        <CustomSimpleBar >
                                            {useStorageData!=null?
                                                <>
                                                    {JSON.parse(useStorageData).map((msg,key)=>(
                                                        <>
                                                            <Stack direction={'column'} mb={1}>
                                                                <Stack direction={'row'} mb={-1}>
                                                                    {msg.iscreatemessage?
                                                                        <AccountCircleIcon sx={{color:'white',mr:1,mb:1,border:'2px solid green',borderRadius:'50%'}} fontSize='large'/>
                                                                    :
                                                                        <AccountCircleIcon sx={{color:'white',mr:1,mb:1}} fontSize='large'/>    
                                                                    }
                                                                    <Stack direction={'column'}>
                                                                        <Typography sx={{color:'white',fontSize:13,mb:-0.5}}>{msg.name}</Typography>
                                                                        <Typography variant='body2' sx={{color:"white"}}>{formatedDateFromTimeStamp(msg.__createtime__)}</Typography>
                                                                    </Stack>
                                                                </Stack>
                                                                <ReactTyped strings={[msg.message]} typeSpeed={15} style={{color:'white',fontSize:15}} showCursor={false}></ReactTyped>
                                                            </Stack>
                                                        </>
                                                    ))}
                                                </>
                                            :
                                                <>
                                                    <Typography sx={{color:'white'}}>クリップしたデータはありません</Typography>
                                                </>
                                            }
                                        </CustomSimpleBar>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                    <Box ref={inputarea} position='fixed' sx={{marginTop:'85vh', bgcolor:'#333132',maxWidth:'90%'}}>
                        <Typography variant='body2'sx={{color:"white"}}>{message.length} / 200</Typography>
                        <Box sx={{border:'1px solid white'}} p={2}>
                            <Box display={'flex'}>
                                <AccountCircleIcon sx={{color:'white',mr:1}} fontSize='large'/>
                                <TextField 
                                    id='input-message' 
                                    hiddenLabel 
                                    variant='standard' 
                                    sx={{width:'80vw',input:{color:'white'}}} 
                                    color='secondary'
                                    onChange={(e)=>setMessage(e.target.value)}
                                    inputProps={{maxLength:200}}
                                    autoComplete='none'
                                    value={message}/>
                                <Button variant='contained' onClick={()=>sendMessage()}>送信</Button>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </CustomBox>
        </>
    )
}

export default ChatZone