import React from 'react'
import { Box, CardMedia, Stack, Typography,Grid ,Image} from '@mui/material'
import styled from '@emotion/styled'

const CustomBox = styled(Box)({
    backgroundColor : '#333132',
    border :"2px solid white",
    borderRadius : 5,
    zIndex:1
})

function RoomImageNav() {
  return (
    <>
    <Grid container>
        <Grid item xs={12} md={12}>
            <CustomBox color={'green'}>
                <Stack direction={'row'}>
                    <img height={150}src={require('../RoomImage/dappi008349_In_a_magical_world_the_castle_stands_tall_with_maje_aba0ed36-f63a-4581-9d58-9024c104c935.webp')}></img>
                    <Stack direction={'column'}>
                        <Typography>President</Typography>
                        <Typography>Room</Typography>
                        <Typography>RoomID</Typography>
                        <Typography>note</Typography>
                    </Stack>
                </Stack>
            </CustomBox>
        </Grid>
    </Grid>
    </>
  )
}

export default RoomImageNav