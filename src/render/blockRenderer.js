module.exports = block =>
	({
		html: block.executableContent,
		css: `<style>${block.executableContent}</style>`,
		js: `<script>${block.executableContent}</script>`,
	}[block.language] || block.executableContent)
