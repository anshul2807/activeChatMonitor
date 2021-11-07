import React,{useEffect,useState} from 'react'
import './Admin.css'
import axios from 'axios';
function Admin() {
    const[current_rooms,setCurrentRooms] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/allrooms')
        .then((res)=>{
            setCurrentRooms(res.data);
            console.log(current_rooms);
        })
    },[])
    return (
        <div className="admin">
            <div className="admin__sec1">
                <h2>All Current Users's</h2>
            </div> 
            <div className="admin__sec2">
                {current_rooms.map((room,id)=>(
                <div key={id} className="admin__block">
                    <h3>Room name : <span>{room.room}</span></h3>
                    <p>User Name : <span>{room.name}</span></p>
                </div>
                ))}
                
            </div>
        </div>
    )
}

export default Admin
