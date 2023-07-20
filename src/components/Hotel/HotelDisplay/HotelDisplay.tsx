import "./HotelDisplay.css";
import "../Hotel.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Hotel } from "../../../types";
import RoomsDisplay from "../../Rooms/RoomsDisplay/RoomDisplay";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import { NotFound } from "../../NotFound/NotFound";
import DialogWrapped from "../../DialogWrapped/DialogWrapped";

function HotelDisplay() {
	const location = useLocation();
	const { getHotel } = useHotelsAPI();
	const navigate = useNavigate();
	const { hotelId } = useParams();
	const [hotel, setHotel] = useState<Hotel>();

	useEffect(() => {
		hotelId && getHotel(hotelId).then((hotel) => setHotel(hotel));
	}, [hotelId, location]);

	if (!hotel)
		return (
			<DialogWrapped open onClose={() => navigate("/agencia")}>
				<NotFound />
				<button onClick={() => navigate("/agencia")}>Cerrar</button>
			</DialogWrapped>
		);

	return (
		<DialogWrapped
			open
			onClose={() => navigate("/agencia")}
			className="hotel dialog display"
		>
			<div className="hotel-display-buttons">
				<button onClick={() => navigate("edit")}>Editar</button>
				<button onClick={() => navigate("/agencia")}>Cerrar</button>
			</div>
			<div className="hotel-display-info">
				<div className="main-info">
					<h1>{hotel.name}</h1>
					<h2>
						<div>
							<span>Localización:</span> <span>{hotel.location}</span>
						</div>
						<div>
							<span>Habilitado:</span> <span>{hotel.active ? "Si" : "No"}</span>
						</div>
					</h2>
				</div>
				<RoomsDisplay rooms={hotel.rooms} />
			</div>
		</DialogWrapped>
	);
}
export default HotelDisplay;
