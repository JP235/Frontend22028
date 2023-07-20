import "./TravelerReservationDialog.css";
import { useEffect, useState } from "react";
import { GuestData } from "../../../types";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import DialogWrapped from "../../DialogWrapped/DialogWrapped";
import { useNavigate } from "react-router-dom";

function TravelerReservationDialog() {
	const [guestData, setGuestData] = useState<GuestData>({
		firstName: "",
		lastName: "",
		birthDate: "",
		gender: "",
		documentType: "",
		documentNumber: "",
		email: "",
		phone: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
	});
	const navigate = useNavigate();
	const { createReservation, getTakenDatesForRoom, getRoom } = useHotelsAPI();
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

	const urlParams = new URLSearchParams(window.location.search);
	const occupants = Number(urlParams.get("occupants"));
	const checkInDate = urlParams.get("checkInDate") || "";
	const checkOutDate = urlParams.get("checkOutDate") || "";
	const hotelId = urlParams.get("hotelId") || "";
	const roomId = urlParams.get("roomId") || "";
	const [pricePerNight, setPricePerNight] = useState<number>(0);
	const [numberOfNights, setNumberOfNights] = useState<number>(0);

	useEffect(() => {
		checkAvailability();
	}, [hotelId, roomId, checkInDate, checkOutDate]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setGuestData((prevGuestData) => ({
			...prevGuestData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isAvailable) {
			await createReservation({
				hotelId: Number(hotelId),
				roomId: Number(roomId),
				checkInDate,
				checkOutDate,
				guestData,
			});
			alert("Reservation created!");
		} else {
			alert("Room is not available for the selected dates.");
		}
	};

	const checkAvailability = async () => {
		if (!hotelId || !roomId || !checkInDate || !checkOutDate) return;
		const room = await getRoom(hotelId, roomId);
		if (!room || room.occupants < occupants) return;
		setPricePerNight(room.final_price);

		const takenDates = await getTakenDatesForRoom(hotelId, roomId);
		const start = new Date(checkInDate);
		const end = new Date(checkOutDate);
		const nNights = Math.round(
			(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
		);
		setNumberOfNights(nNights);
		let available = true;
		for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
			if (takenDates.includes(date.toISOString().split("T")[0])) {
				available = false;
				break;
			}
		}
		setIsAvailable(available);
	};

	return (
		<DialogWrapped
			open={true}
			onClose={() => {
				navigate(-1);
			}}
			className="dialog traveler reservation"
		>
			<h2>Reservar habitación {roomId}</h2>
			{/* <button onClick={checkAvailability}>Check Availability</button> */}
			{isAvailable ? (
				<>
					<p>Check-in: {checkInDate}</p>
					<p> Check-out: {checkOutDate}</p>
					<p> Precio Por Noche ${pricePerNight}</p>
					<p> Precio Final ${pricePerNight * numberOfNights}</p>
				</>
			) : (
				<>
					<p>Habitacion No disponible para las fechas seleccionadas</p>
					<button onClick={() => navigate(-1)}>Volver</button>
				</>
			)}
			<form onSubmit={handleSubmit}>
				<label htmlFor="firstName">
					Nombres:
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={guestData.firstName}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="lastName">
					Apellidos:
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={guestData.lastName}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="birthDate">
					Fecha de nacimiento:
					<input
						type="date"
						id="birthDate"
						name="birthDate"
						value={guestData.birthDate}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="gender">
					Género:
					<select
						id="gender"
						name="gender"
						value={guestData.gender}
						onChange={handleInputChange}
						required
					>
						<option value="">--</option>
						<option value="Male">Hombre</option>
						<option value="Female">Mujer</option>
						<option value="Other">Otro</option>
					</select>
				</label>
				<label htmlFor="documentType">
					Tipo de documento:
					<select
						id="documentType"
						name="documentType"
						value={guestData.documentType}
						onChange={handleInputChange}
						required
					>
						<option value="">--</option>
						<option value="Passport">Pasaporte</option>
						<option value="ID">CC</option>
						<option value="ID">CE</option>
					</select>
				</label>
				<label htmlFor="documentNumber">
					Número de documento:
					<input
						type="text"
						id="documentNumber"
						name="documentNumber"
						value={guestData.documentNumber}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="email">
					Email:
					<input
						type="email"
						id="email"
						name="email"
						value={guestData.email}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="phone">
					Teléfono:
					<input
						type="tel"
						id="phone"
						name="phone"
						value={guestData.phone}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="emergencyContactName">
					Contacto de emergencia:
					<input
						type="text"
						id="emergencyContactName"
						name="emergencyContactName"
						value={guestData.emergencyContactName}
						onChange={handleInputChange}
						required
					/>
				</label>
				<label htmlFor="emergencyContactPhone">
					Tel. emergencia:
					<input
						type="tel"
						id="emergencyContactPhone"
						name="emergencyContactPhone"
						value={guestData.emergencyContactPhone}
						onChange={handleInputChange}
						required
					/>
				</label>
				<button type="submit">Enviar</button>
			</form>
		</DialogWrapped>
	);
}

export default TravelerReservationDialog;
