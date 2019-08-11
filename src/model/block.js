module.exports = class {
	constructor({ specimenName, language, displayContent, executableContent = null, flags = {}, props = {} }) {
		this.specimenName = specimenName
		this.language = language
		this.displayContent = displayContent
		this.executableContent = executableContent || null
		this.flags = flags || {}
		this.props = props || {}
	}
}
