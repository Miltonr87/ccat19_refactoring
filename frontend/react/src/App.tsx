import { useState } from "react";
import SignupForm from "./SignupForm";

function App() {
	const [form, setForm] = useState(new SignupForm());

	function reload (fn: any) {
		if (fn) fn();
		setForm(clone(form));
	}

	function clone(obj: any) {
		var copy = new obj.constructor;
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	// async function confirm () {
	// 	const input = {
	// 		name,
	// 		email,
	// 		document,
	// 		password
	// 	}
	// 	const response = await fetch("http://localhost:3000/signup", {
	// 		method: "post",
	// 		headers: {
	// 			"content-type": "application/json"
	// 		},
	// 		body: JSON.stringify(input)
	// 	});
	// 	const output = await response.json();
	// 	setMessage("success");
	// }

	// function fill () {
	// 	setName("John Doe");
	// 	setEmail("john.doe@gmail.com");
	// 	setDocument("97456321558");
	// 	setPassword("asdQWE123");
	// }

	return (
		<div>
			<div>{ form.step }</div>
			<div>{ form.getProgress() }</div>
			{ form.step === 1 && <div>
				<div>
					<input className="input-name" value={form.name} onChange={(e) => reload(() => form.name = e.target.value)}/>
				</div>
				<div>
					<input className="input-email" value={form.email} onChange={(e) => reload(() => form.email = e.target.value)}/>
				</div>
				<div>
					<input className="input-document" value={form.document} onChange={(e) => reload(() => form.document = e.target.value)}/>
				</div>
			</div>}
			{ form.step === 2 && <div>
				<div>
					<input className="input-password" value={form.password} onChange={(e) => reload(() => form.password = e.target.value)}/>
				</div>
				<div>
					<input className="input-confirm-password" value={form.confirmPassword} onChange={(e) => reload(() => form.confirmPassword = e.target.value)}/>
				</div>
			</div>}
			<span className="span-error">{ form.error }</span>
			<button className="button-fill" onClick={() => reload(() => form.fill())}>Fill</button>
			{ form.step === 2 && <button className="button-previous" onClick={() => reload(() => form.previous())}>Previous</button>}
			{ form.step === 1 && <button className="button-next" onClick={() => reload(() => form.next())}>Next</button>}
			{ form.step === 2 && <button className="button-confirm" onClick={() => reload(() => form.confirm())}>Confirm</button>}
		</div>
	)
}

export default App
