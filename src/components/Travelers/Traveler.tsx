import "./Traveler.css";
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

function Traveler() {
	const navigate = useNavigate();
	const [occupants, setOccupants] = useState("");
	const [checkInDate, setCheckInDate] = useState("");
	const [checkOutDate, setCheckOutDate] = useState("");

	const today = new Date().toISOString().split("T")[0];
	const nav = () =>
		navigate(
			`/viajero/buscar?occupants=${occupants}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
		);
	const minCheckOutDate =
		checkInDate &&
		new Date(new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0];

	useEffect(() => {
		if (occupants && checkInDate && checkOutDate) nav();
	}, [occupants, checkInDate, checkOutDate]);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		nav();
	};

	return (
		<div className="traveler">
			<div className="search-form-container">
				<h1>Buscar:</h1>
				<form onSubmit={handleSubmit}>
					<label>
						Huéspedes:
						<input
							type="number"
							value={occupants}
							onChange={(event) => setOccupants(event.target.value)}
						/>
					</label>
					<label>
						Check-in:
						<input
							type="date"
							value={checkInDate}
							min={today}
							placeholder={today}
							onChange={(event) => setCheckInDate(event.target.value)}
						/>
					</label>
					<label>
						Check-out:
						<input
							type="date"
							value={checkOutDate}
							min={minCheckOutDate}
							onChange={(event) => setCheckOutDate(event.target.value)}
						/>
					</label>
					{/* <button type="submit">Buscar</button> */}
				</form>
				<br />
				{occupants && checkInDate && checkOutDate && (
					<div className="seach-details">
						Huespedes: {occupants}
						<br />
						Check-in: {checkInDate} <br />
						Check-out: {checkOutDate} <br />
					</div>
				)}
			</div>
            <Outlet />
		</div>
	);
}
export default Traveler;
