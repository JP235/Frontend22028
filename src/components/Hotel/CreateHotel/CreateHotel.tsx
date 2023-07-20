import "./CreateHotel.css";
import "../Hotel.css";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel } from "../../../types";
import { useHotelsAPI } from "../../../hooks/useHotelsApi";
import DialogWrapped from "../../DialogWrapped/DialogWrapped";

function CreateHotel() {
	const navigate = useNavigate();
	const { createHotel } = useHotelsAPI();
	const [newHotel, setNewHotel] = useState<Pick<Hotel, "name" | "location">>({
		name: "",
		location: "",
	});

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!newHotel) {
			return;
		}
		const hotel = await createHotel(newHotel);
		navigate(`/agencia/hotel/${hotel.id}`, {
			relative: "route",
			replace: true,
		});
	};
	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<DialogWrapped
			open
			className="hotel dialog create"
			onClose={() => navigate("/agencia")}
		>
			<h1>Agregar Hotel</h1>
			<form onSubmit={handleSubmit} className="hotel-create-form">
				<h2>
					<div>
						<label>
							<span>Nombre:</span>
							<input
								type="text"
								value={newHotel?.name}
								onChange={(event) =>
									setNewHotel((prev) => ({ ...prev, name: event.target.value }))
								}
							/>
						</label>
					</div>
					<div>
						<label>
							<span>Localizacion:</span>
							<input
								type="text"
								value={newHotel?.location}
								onChange={(event) =>
									setNewHotel((prev) => ({
										...prev,
										location: event.target.value,
									}))
								}
							/>
						</label>
					</div>
				</h2>
				<button type="submit">Agregar</button>
				<button type="button" onClick={handleCancel}>
					Cancelar
				</button>
			</form>
		</DialogWrapped>
	);
}
export default CreateHotel;
