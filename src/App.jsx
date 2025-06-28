import { useState, useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Upload, Play, Repeat } from 'lucide-react'
import './App.css'

function App() {
  const [code, setCode] = useState('// Escribe tu código Rust aquí')
  const [output, setOutput] = useState('')
  const [assembly, setAssembly] = useState('')
  const [view, setView] = useState('executed') // 'executed' or 'assembly'
  const fileInputRef = useRef()

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setCode(evt.target.result)
      }
      reader.readAsText(file)
    } else {
      alert('Por favor sube un archivo .txt')
    }
  }

  const handleCompile = () => {
    // Mocked compile logic
    setOutput('Salida ejecutada: ¡Hola, mundo!')
    setAssembly('Código ensamblador:\nMOV RAX, 1\nMOV RBX, 2\nADD RAX, RBX')
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Rust Compiler</h1>
      <div className="compiler-container">
        <div className="editor-panel">
          <div className="editor-header">
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
              title="Subir archivo .txt"
            >
              <Upload size={18} /> Subir
            </button>
            <input
              type="file"
              accept=".txt"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleUpload}
            />
          </div>
          <MonacoEditor
            height="400px"
            language="rust"
            value={code}
            onChange={handleEditorChange}
            options={{
              selectOnLineNumbers: true,
              fontSize: 16,
              minimap: { enabled: false },
              lineNumbers: 'on',
            }}
          />
          <button className="compile-btn" onClick={handleCompile}>
            <Play size={18} /> Compilar
          </button>
        </div>
        <div className="output-panel">
          <div className="output-header">
            <span>Salida del Compilador</span>
            <div className="toggle-group">
              <button
                className={view === 'executed' ? 'active' : ''}
                onClick={() => setView('executed')}
              >
                Ejecutado
              </button>
              <button
                className={view === 'assembly' ? 'active' : ''}
                onClick={() => setView('assembly')}
              >
                Ensamblador
              </button>
            </div>
          </div>
          <pre className="output-content">
            {view === 'executed' ? output : assembly}
          </pre>
        </div>
      </div>
      <div className="credits">
        Hecho por: Eduardo Aragon, Mikel Bracamonte, Laura Nagamine
      </div>
    </div>
  )
}

export default App
