import "./AdminDash.css";
import { useState, useEffect } from "react";
import { Hotel } from "../../types";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useHotelsAPI } from "../../hooks/useHotelsApi";

function AdminDash() {
	const { getHotels } = useHotelsAPI();
	const location = useLocation();
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const auth = useUserAuth();
	const navigate = useNavigate();

	useEffect(() => {
		getHotels().then((hotels) => setHotels(hotels));
	}, [location]);

	const handleLogout = () => {
		auth.logout(() => navigate("/"));
	};
	const handleCreateHotel = () => {
		navigate("create_new_hotel", { relative: "path" });
	};

	return (
		<>
			<Outlet />
			<div>
				<div className="user-info">
					<span>{auth.user}</span>
					<button className="logout" type="button" onClick={handleLogout}>
						Cerrar sesion
					</button>
				</div>
				<div className="header">
					<h2>Hotels</h2>
				</div>
				<table className="hotel-list">
					<thead>
						<tr>
							<th>ID</th>
							<th>Nombre</th>
							<th>Localizacion</th>
							<th>#Habitaciones</th>
							<th colSpan={2}>Habilitado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{hotels.map((hotel) => (
							<HotelList key={hotel.id} hotel={hotel} />
						))}
						<tr>
							<td colSpan={8}>
								<button
									className="new-hotel-button"
									type="button"
									onClick={handleCreateHotel}
								>
									Nuevo Hotel
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}
export default AdminDash;

interface HotelListProps {
	hotel: Hotel;
}

function HotelList({ hotel }: HotelListProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { updateHotel: editHotel } = useHotelsAPI();
	const handleEditHotel = (id: number) => {
		// e.stopPropagation();
		navigate(`hotel/${id}`, { relative: "path" });
	};
	const handleActivateHotel = async (id: number) => {
		await editHotel(String(id), { active: !hotel.active });
		navigate("?");
	};
	return (
		<tr onClick={() => handleEditHotel(hotel.id)}>
			{/* <td>
				<button onClick={() => }>Ver</button>
			</td> */}
			<td>{hotel.id}</td>
			<td>{hotel.name}</td>
			<td>{hotel.location}</td>
			<td>{hotel.rooms.length}</td>
			<td>{hotel.active ? "Si" : "No"}</td>
			<td>
				<button
					onClick={(e) => {
						e.stopPropagation();
						handleActivateHotel(hotel.id);
					}}
				>
					{hotel.active ? "Deshabilitar" : "Habilitar"}
				</button>
			</td>
			<td>
				<button
					onClick={(e) => {
						e.stopPropagation();
						navigate(`hotel/${hotel.id}/reservas`, {
							relative: "path",
							state: { from: location },
						});
					}}
				>
					Reservas
				</button>
			</td>
		</tr>
	);
}
