import "./RoomDisplay.css";
import "../Rooms.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Room } from "../../../types";
import { Fragment, useEffect, useState } from "react";
import React from "react";

const EditButton = ({ room }: { room: Room }) => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const newRoom = useLocation().pathname.includes("new_room");
	return (
		<button
			disabled={newRoom || (roomId != undefined && roomId != String(room.id))}
			onClick={() => navigate(`${room.id}`)}
		>
			Editar
		</button>
	);
};

const ReserveButton = ({ room }: { room: Room }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [occupants, setOccupants] = React.useState(1);
	const [checkInDate, setCheckInDate] = useState("");
	const [checkOutDate, setCheckOutDate] = useState("");
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const occupants = searchParams.get("occupants");
		const checkInDate = searchParams.get("checkInDate");
		const checkOutDate = searchParams.get("checkOutDate");
		setOccupants(occupants ? Number(occupants) : 1);
		setCheckInDate(checkInDate ? checkInDate : "");
		setCheckOutDate(checkOutDate ? checkOutDate : "");
		// console.log(room, occupants, checkInDate, checkOutDate);
	}, []);

	return (
		<button
			onClick={() => {
				navigate(
					`/viajero/reservar?occupants=${occupants}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&hotelId=${room.hotelId}&roomId=${room.id}`
				);
			}}
		>
			Reservar
		</button>
	);
};

export function RoomsDisplay({
	rooms,
	actionButton,
}: {
	rooms: Room[];
	actionButton?: "edit" | "reserve";
}) {
	const { roomId: roomIdEditing } = useParams();
	if (!rooms.length) {
		return <p>No rooms</p>;
	}

	return (
		<>
			<div className="rooms-display-container">
				<h2>Habitaciones</h2>
				<div className="rooms-display">
					{rooms.map((room) => (
						<Fragment key={room.id}>
							{roomIdEditing !== String(room.id) && (
								<RoomDisplay room={room} actionButton={actionButton} />
							)}
							{roomIdEditing === String(room.id) && <Outlet />}
						</Fragment>
					))}
				</div>
			</div>
		</>
	);
}
export default RoomsDisplay;

export const RoomDisplay = ({
	room,
	actionButton,
}: {
	room: Room;
	actionButton?: "edit" | "reserve" | "delete";
}) => {
	const agency = useLocation().pathname.includes("agencia");
	return (
		<div className="room">
			<div className="room-display-header">
				<h2>Habitación {room.id} </h2>
				{actionButton === "edit" && <EditButton room={room} />}
				{actionButton === "reserve" && <ReserveButton room={room} />}
			</div>
			<div className="room-content">
				<div className="room-column">
					<p>Ocupantes:</p>
					{agency && <p>Habilitada:</p>}
					<p>Precio Inicial:</p>
					<p>Impuestos:</p>
					<p>Precio Final:</p>
				</div>
				<div className="room-column">
					<p>{room.occupants}</p>
					{agency && <p>{room.active ? "Si" : "No"}</p>}
					<p>${room.initial_price.toFixed(2)}</p>
					<p>${room.tax.toFixed(2)}</p>
					<p>${room.final_price.toFixed(2)}</p>
				</div>
			</div>
		</div>
	);
};
