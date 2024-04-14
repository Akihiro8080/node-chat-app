import './App.css';
import { selectUser } from './Features/userSlice';
import { useSelector } from 'react-redux';
import LoginUser from './UIcomponents/LoginUser';
import { Route, Routes } from 'react-router-dom';
import RoomView from './PageView/RoomView';

function App() {

  const user = useSelector(selectUser);
  return (
    <div className="App">
      {user ?
        <Routes>
          <Route path="/" element={<RoomView/>}/>
        </Routes>
      :
        <Routes>
          <Route path="/" element={<LoginUser/>}/>
        </Routes>
      }
    </div>
  );
}

export default App;
