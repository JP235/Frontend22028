import "./HotelReservation.css";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Hotel, Reservation } from "../../types";
import { useHotelsAPI } from "../../hooks/useHotelsApi";
import { HotelsAPIContext } from "../../contexts/HotelContext";
import DialogWrapped from "../DialogWrapped/DialogWrapped";

export const HotelReservations = () => {
	const navigate = useNavigate();
	const { hotelId } = useParams();
	const { getReservationsForHotel, getHotel } = useHotelsAPI();
	const { reservationId } = useParams<{ reservationId: string }>();
	const location = useLocation();
	const state = location.state as { from: Location };
	const from = state?.from.pathname ?? "/agencia";
	const navBack = () => navigate(from, { replace: true });

	const [reservations, setReservations] = React.useState<Reservation[]>([]);
	const [hotel, setHotel] = React.useState<Hotel>();

	useEffect(() => {
		if (!hotelId) return;
		getReservationsForHotel(hotelId).then(
			(reservations) => reservations && setReservations(reservations)
		);

		getHotel(hotelId).then((hotel) => hotel && setHotel(hotel));
	}, [hotelId]);

	const groupedReservations = reservations.reduce((acc, reservation) => {
		if (!acc[reservation.roomId]) {
			acc[reservation.roomId] = [];
		}
		acc[reservation.roomId].push(reservation);
		return acc;
	}, {} as Record<number, Reservation[]>);

	return (
		<DialogWrapped open className="hotel dialog reservations" onClose={navBack}>
			<div className="hotel-reservations-header">
				<h2>
					Reservas en <i>{hotel?.name}</i>{" "}
				</h2>
				<button onClick={() => navBack()}>Volver</button>
			</div>
			<table>
				<thead>
					<tr>
						<th>Entrada</th>
						<th>Salida</th>
						<th>Nombre Reserva</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(groupedReservations).map(
						([roomId, reservations], index) => (
							<Fragment key={roomId}>
								<tr>
									<td className="room-id" colSpan={4}>
										Habitación {roomId}
									</td>
								</tr>
								{reservations
									.sort(
										(a, b) =>
											new Date(a.checkInDate).getTime() -
											new Date(b.checkInDate).getTime()
									)
									.map((reservation) => (
										<Fragment key={reservation.id}>
											<tr
												className={
													index % 2 === 0
														? "even reservation-row"
														: "odd reservation-row"
												}
											>
												<td>{reservation.checkInDate}</td>
												<td>{reservation.checkOutDate}</td>
												<td>{`${reservation.guestData.firstName} ${reservation.guestData.lastName}`}</td>
												<td>
													<button
														type="button"
														onClick={() => {
															{
																reservationId === String(reservation.id)
																	? navigate("./")
																	: navigate(`${reservation.id}`);
															}
														}}
													>
														{reservationId === String(reservation.id)
															? "Ver Menos"
															: "Detalles"}
													</button>
												</td>
											</tr>
											<tr
												className={
													reservationId === String(reservation.id)
														? "active details"
														: "inactive details"
												}
											>
												{reservationId === String(reservation.id) && <Outlet />}
											</tr>
										</Fragment>
									))}
							</Fragment>
						)
					)}
				</tbody>
			</table>
		</DialogWrapped>
	);
};

export const ReservationDetails = () => {
	const { reservationId } = useParams<{ reservationId: string }>();
	const [reservation, setReservation] = useState<Reservation | undefined>();
	const hotelsAPI = useContext(HotelsAPIContext);

	useEffect(() => {
		reservationId &&
			hotelsAPI
				.getReservation(reservationId)
				.then((reservation) => setReservation(reservation));
	}, [hotelsAPI, reservationId]);

	if (!reservation) {
		return null;
	}

	return (
		<td colSpan={4}>
			<ul className="reservation-details">
				<li>
					<span>Entrada:</span> {reservation.checkInDate}
				</li>
				<li>
					<span>Salida:</span> {reservation.checkOutDate}
				</li>
				<li>
					<span>Nombre:</span>{" "}
					{`${reservation.guestData.firstName} ${reservation.guestData.lastName}`}
				</li>
				<li>
					<span>Fecha de nacimiento:</span> {reservation.guestData.birthDate}
				</li>
				<li>
					<span>Género:</span> {reservation.guestData.gender}
				</li>
				<li>
					<span>Email:</span> {reservation.guestData.email}
				</li>
				<li>
					<span>Tipo de documento:</span> {reservation.guestData.documentType}
				</li>
				<li>
					<span>Número de documento:</span>{" "}
					{reservation.guestData.documentNumber}
				</li>
				<li>
					<span>Teléfono:</span> {reservation.guestData.phone}
				</li>
				<li>
					<span></span>
				</li>
				<li>
					<span>Contacto de emergencia:</span>{" "}
					{reservation.guestData.emergencyContactName}
				</li>
				<li>
					<span>Tel. emergencia:</span>{" "}
					{reservation.guestData.emergencyContactPhone}
				</li>
			</ul>
		</td>
	);
};
