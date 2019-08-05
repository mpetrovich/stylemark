module.exports = block =>
	({
		html: block.content,
		css: `<style>${block.content}</style>`,
		js: `<script>${block.content}</script>`,
	}[block.language] || block.content)
