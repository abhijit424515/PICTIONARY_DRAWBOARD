import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo, turn}) => {
    console.log("here bebi");
    const imgRef = useRef(null);
    console.log(imgRef.current);
    useEffect(() => {
        socket.on("message", (data) => {
            toast.info(data.message);
        });
    }, []);
    useEffect(() => {
        socket.on("users", (data) => {
            setUsers(data);
            setUserNo(data.length);
        });
    }, []);
    useEffect(() => {
        socket.on("canvasImage", (data) => {
            // console.log(imgRef);
            console.log("now setinggggggg");
            document.getElementById("hibebi").ref = imgRef;
            console.log(imgRef.current);
            imgRef.current.src = data;
        });
    }, []);

    // socket.on("canvasImage", (data) => {
    //     // console.log(imgRef);
    //     imgRef.current.src = data;
    // });

    return (
        
            <div className="container-fluid">
                <div className="row pb-2">
                    <h1 className="display-5 pt-4 pb-3 text-center">
                        React Drawing App - users online:{userNo}
                    </h1>
                </div>
                <div className="row mt-5">
                    <div
                        className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
            mt-3"
                        style={{ height: "500px" }}
                    >
                        <img id="hibebi" className="w-100 h-100" ref={imgRef} src="" alt="image" />
                    </div>
                </div>
            </div>
    );
};

export default ClientRoom;
