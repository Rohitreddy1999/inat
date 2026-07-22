import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'

const projectRoot = process.cwd()
const runtimePath = path.join(projectRoot, 'assets', 'webview', 'meditationFigureHtml.ts')
const referencePath = path.join(projectRoot, 'assets', 'webview', 'Meditation Figure.html')

const source = await readFile(runtimePath, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText

const runtimeModule = { exports: {} }
const loadRuntime = new Function('exports', 'module', 'require', compiled)
loadRuntime(runtimeModule.exports, runtimeModule, () => undefined)

const { getMeditationFigureHtml } = runtimeModule.exports
if (typeof getMeditationFigureHtml !== 'function') {
  throw new Error('Meditation figure generator could not be loaded')
}

const graduationReference = getMeditationFigureHtml({
  mode: 'graduation',
  reducedMotion: false,
})

await writeFile(referencePath, `${graduationReference}\n`, 'utf8')
console.log(`Synchronized ${path.relative(projectRoot, referencePath)}`)
