import "./HotelEdit.css";
import "../Hotel.css";
import { FormEvent, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Hotel, Room } from "../../../types";
import RoomsDisplay from "../../Rooms/RoomsDisplay/RoomDisplay";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import DialogWrapped from "../../DialogWrapped/DialogWrapped";

function HotelEdit() {
	const { hotelId } = useParams();
	const location = useLocation();
	const newRoom = useLocation().pathname.includes("new_room");
	const { getHotel, updateHotel } = useHotelsAPI();
	const [hotel, setHotel] = useState<Hotel | null>(null);
	const [hotelBackup, setHotelBackup] = useState<Hotel | null>(null);
	const [name, setName] = useState("");
	const [hotelLocation, setHotelLocation] = useState("");
	const [active, setHotelActive] = useState(false);
	const [rooms, setRooms] = useState<Room[]>([]);
	const navigate = useNavigate();

	if (!hotelId) return <dialog open>Loading...</dialog>;

	useEffect(() => {
		getHotel(hotelId).then((hotel) => {
			if (!hotel) return;
			setHotel(hotel);
			setName(hotel.name);
			setHotelLocation(hotel.location);
			setHotelActive(hotel.active);

			setRooms(hotel.rooms);
			setHotelBackup(hotel);
		});
	}, [hotelId, location]);

	const handleSave = async (event: FormEvent) => {
		event.preventDefault();
		await updateHotel(String(hotelId), {
			name,
			location: hotelLocation,
			rooms,
			active,
		});
		navigate("../");
	};

	const handleCancel = () => {
		setHotel(hotelBackup);
		setName(hotelBackup!.name);
		setHotelLocation(hotelBackup!.location);
		setRooms(hotelBackup!.rooms);
		navigate("../");
	};

	return (
		<DialogWrapped
			open
			className="hotel dialog edit"
			onClose={() => navigate("../")}
		>
			{!newRoom && (
				<div className="hotel-edit-buttons">
					<button type="submit" onClick={handleSave}>
						Guardar
					</button>
					<button type="button" onClick={handleCancel}>
						Cancelar
					</button>
				</div>
			)}
			<h2>
				<form className="hotel-edit-form">
					<label>
						<span>Nombre:</span>
						<input
							disabled={newRoom}
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</label>

					<label>
						<span>Localizacion:</span>
						<input
							disabled={newRoom}
							type="text"
							value={hotelLocation}
							onChange={(event) => setHotelLocation(event.target.value)}
						/>
					</label>
					<label>
						<span>Habilitado:</span>
						<input
							disabled={newRoom}
							type="checkbox"
							checked={active}
							onChange={(event) => setHotelActive(event.target.checked)}
						/>
					</label>
				</form>
			</h2>
			{newRoom && <Outlet context={{ hotelId, hotel }} />}
			{!newRoom && (
				<button
					className="new-room-button"
					onClick={() => navigate("new_room", { replace: false })}
				>
					Nueva habitación
				</button>
			)}
			<RoomsDisplay rooms={rooms} actionButton="edit" />
		</DialogWrapped>
	);
}
export default HotelEdit;
