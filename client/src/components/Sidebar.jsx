import React, { useRef } from "react";
import { Socket } from "socket.io-client";

const Sidebar = ({ users, user, socket, turn, setTurn}) => {
  const sideBarRef = useRef(null);

  const openSideBar = () => {
    sideBarRef.current.style.left = 0;
  };
  const closeSideBar = () => {
    sideBarRef.current.style.left = -100 + "%";
  };

  // Toggle turn for a given user
  const Toggle = () => {
    setTurn(!turn);
    console.log(turn)
    socket.emit('turn', !turn); 
  }

  // Receive change of turn from server
  socket.on('turn', (data) => {
    console.log("server sent " + data);
    setTurn(data);
  });

  return (
    <>
      <button
        className="btn btn-dark btn-sm"
        onClick={openSideBar}
        style={{ position: "absolute", top: "5%", left: "5%" }}
      >
        Users
      </button>

      {/* Button for toggling users */}
      <button
        className="btn btn-dark btn-sm"
        onClick={Toggle}
        style={{ position: "absolute", top: "5%", right: "5%" }}
      >
        Toggle Role
      </button>


      <div
        className="position-fixed pt-2 h-100 bg-dark"
        ref={sideBarRef}
        style={{
          width: "150px",
          left: "-100%",
          transition: "0.3s linear",
          zIndex: "9999",
        }}
      >
        <button
          className="btn btn-block border-0 form-control rounded-0 btn-light"
          onClick={closeSideBar}
        >
          Close
        </button>
        <div className="w-100 mt-5">
          {users.map((usr, index) => (
            <p key={index} className="text-white text-center py-2">
              {usr.username}
              {usr.id === socket.id && " - (You)"}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
