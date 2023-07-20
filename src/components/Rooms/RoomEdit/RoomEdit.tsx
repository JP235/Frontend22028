import "./RoomEdit.css";
import "../Rooms.css";
import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import { Room } from "../../../types";

export const RoomEdit = ({}: {}) => {
	const navigate = useNavigate();
	const { hotelId, roomId } = useParams();
	const { getRoom, createRoom, updateRoom, deleteRoom } = useHotelsAPI();
	const isNew = !roomId;
	const [active, setActive] = useState(false);
	const [occupants, setOccupants] = useState(0);
	const [initialPrice, setInitialPrice] = useState(0);
	const [tax, setTax] = useState(0);

	const final_price = initialPrice + tax;

	if (!hotelId || !roomId) {
		if (!(isNew === true)) {
			return <p>No room</p>;
		}
	}
	useEffect(() => {
		hotelId &&
			roomId &&
			getRoom(hotelId, roomId).then((room) => {
				if (room) {
					setActive(room.active);
					setInitialPrice(room.initial_price);
					setTax(room.tax);
					setOccupants(room.occupants);
				}
			});
	}, [hotelId, roomId]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		let room: Room | undefined;
		if (isNew === true) {
			if (occupants === 0 || initialPrice === 0 || tax === 0) return;
			room = await createRoom(parseInt(hotelId!), {
				hotelId: parseInt(hotelId!),
				occupants: occupants,
				initial_price: initialPrice,
				tax: tax,
				active: active,
				final_price: initialPrice + tax,
			});
		} else if (hotelId && roomId) {
			room = await updateRoom(hotelId, roomId, {
				occupants: occupants,
				initial_price: initialPrice,
				tax: tax,
				active: active,
				final_price: initialPrice + tax,
			});
		}
		if (room) {
			navigate("../");
		}
	};

	const handleDeleteRoom = async () => {
		await deleteRoom(hotelId!, roomId!);
		navigate("../");
	};

	return (
		<div className={roomId ? "room" : "room new-room"}>
			{roomId && (
				<>
					<div className="room-display-header">
						<h2>
							Habitación {roomId}
							<button type="button" onClick={handleDeleteRoom}>
								Borrar
							</button>
						</h2>
					</div>
				</>
			)}
			<form onSubmit={handleSubmit}>
				<button type="submit">Guardar</button>
				<button
					type="button"
					onClick={() => {
						navigate("../");
					}}
				>
					Cancelar
				</button>
				<div className="room-content">
					<div className="room-column">
						<p>
							<label>
								<span>Ocupantes:</span>
							</label>
						</p>
						<p>
							<label>
								<span>Habilitada:</span>
							</label>
						</p>
						<p>
							<label>
								<span>Precio Inicial:</span>
							</label>
						</p>
						<p>
							<label>
								<span>Impuestos:</span>
							</label>
						</p>
						<p>
							<label>
								<span>Precio Final:</span>
							</label>
						</p>
					</div>
					<div className="room-column">
						<p>
							<input
								type="number"
								value={occupants}
								onChange={(e) => setOccupants(parseInt(e.target.value))}
								required
								placeholder="Tipo de Habitación"
							/>
						</p>
						<p>
							<input
								type="checkbox"
								checked={active}
								onChange={(e) => setActive(e.target.checked)}
								name="active"
								id="active"
							/>
						</p>
						<p>
							<input
								type="number"
								value={initialPrice}
								onChange={(e) => setInitialPrice(Number(e.target.value))}
								required
								name="initial_price"
								id="initial_price"
							/>
						</p>
						<p>
							<input
								type="number"
								value={tax}
								onChange={(e) => setTax(Number(e.target.value))}
								required
								name="tax"
							/>
						</p>
						<p>
							<p>${final_price.toFixed(2)}</p>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};
export default RoomEdit;
