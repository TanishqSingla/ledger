class ModalDialog extends HTMLDialogElement {
	constructor() {
		super();

		this.addEventListener("click", this.handleOutsideClick);
	}

	handleOutsideClick(event) {
		const rect = this.getBoundingClientRect();
		const outsideDialog = event.clientY <= rect.top ||
			event.clientX <= rect.left || event.clientX >= rect.right ||
			event.clientY >= rect.bottom;

		if (outsideDialog) this.close();
	}
}

customElements.define("modal-dialog", ModalDialog, { extends: "dialog" });
