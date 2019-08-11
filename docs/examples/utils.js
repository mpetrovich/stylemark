export const onClick = (selector, msg) => {
	document.querySelector(selector).addEventListener('click', () => {
		alert(msg)
	})
}

export const onChange = (selector, msg) => {
	document.querySelector(selector).addEventListener('change', event => {
		alert(msg(event.target.value))
	})
}
