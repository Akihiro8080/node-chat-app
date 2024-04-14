import { Box, Typography } from '@mui/material'
import React, { useEffect, useState,useCallback ,useSyncExternalStore} from 'react'

const ROOMID = 1; //ルームIDを利用した操作のために定義

const StorageID = `${ROOMID}/MyStorage`

function ChatArchive() {

    const [savedata,setSavedata] = useState(localStorage.getItem(StorageID))

    useEffect(() => {
        console.log(savedata)
    },[savedata])

    const subscribe = (callback) => {
        window.addEventListener('storage',callback);
        return () => window.removeEventListener('storage',callback)
    }

    const getStorageData = () => {
        const data = localStorage.getItem(StorageID)
        return data;
    }

    const useStorageData = useSyncExternalStore(subscribe,getStorageData,()=> "");

    return (
        //チャットログ内の画面にデータを固定表示するために　fixed修飾
        <Box position={'fixed'}> 
            <Typography sx={{color:'yellow'}}>データ一覧</Typography>
            {useStorageData!=null?
                <>
                <Typography color={'white'} fontSize={15}>
                    {useStorageData}
                </Typography>
                </>
            :
                <>
                    <Typography sx={{color:'white'}}>ここにメッセージをアーカイブとして残すことができます</Typography>
                </>
            }
        </Box>
    )
}

export default ChatArchive