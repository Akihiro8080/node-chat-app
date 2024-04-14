const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const mysql = require('mysql2')
const multer = require('multer')

app.use(cors())
let clientcounter=0;
let messagecounter = 0;
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadpath);
    },
    filename: function (req, file, cb) {
        const userid = req.originalUrl.split(":")[1]
        const identifier = file.originalname.split(".")[1]
        cb(null, userid+("_")+req.body.time+("_")+file.fieldname+(".")+identifier)
    },
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'akihiropassmysql0814',
    database: 'chatapp'
});

io.on('connection',(socket)=>{
    clientcounter++;
    console.log(`ユーザとの通信が確立されました ${socket.id} : クライアント数--->${clientcounter}`)
    //接続遮断時の動作
    socket.on("disconnect",()=>{
        clientcounter--
        console.log("クライアント数--->"+clientcounter)
    })
    //メッセージが送信されてきた際の動作
    socket.on("send_message",(data) =>{
        messagecounter++;
        //ブラウザも含めて、同じ条件をクリアすると、socket.idは一意を示す
        let __createtime__ = Date.now();
        socket.broadcast.emit('chat_data',{
            counter : messagecounter,
            name : data.name,
            message : data.message,
            __createtime__,
            iscreatemessage : false
        })
        io.to(socket.id).emit('chat_data',{
            counter : messagecounter,
            name : data.name,
            message : data.message,
            __createtime__,
            iscreatemessage : true
        })
        
    })

})

app.post('/loginuser',upload.none(),function(req,res,next){
    console.log("received data ----post: /loginuser");
    connection.query(
        `SELECT * FROM user WHERE Name='${req.body.login_name}'&&Password='${req.body.login_password}'`,
        function(err,results,fields){
            if(err){
                console.log('error of userLogin');
                res.status(401).redirect();
            }
            if(results[0]===undefined){
                res.status(300).json("login_failure")
                return
            }
            res.status(200).json({"username":results[0].Name,"id":results[0].UserID});
        }
    )
})

server.listen(8080,()=>console.log("データベース接続完了しました"))