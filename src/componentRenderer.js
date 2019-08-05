module.exports = (component, { specimenRenderer }) => `${component.contentHtml}
${component.specimens.map(specimenRenderer).join('\n')}`
