import { useState, useRef, useEffect } from 'react'
import { Upload, Play, Download, Settings, FileText, Terminal, Code, Zap, AlertCircle, CheckCircle, Copy, RefreshCw } from 'lucide-react'
import MonacoEditor from '@monaco-editor/react'

function App() {
  const [code, setCode] = useState(`fn main() {
    println!("¡Hola, mundo desde Rust!");
    
    let mut contador = 0;
    for i in 1..=5 {
        contador += i;
        println!("Iteración {}: contador = {}", i, contador);
    }
    
    let resultado = factorial(5);
    println!("Factorial de 5 = {}", resultado);
}

fn factorial(n: u32) -> u32 {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}`)
  const [output, setOutput] = useState('')
  const [assembly, setAssembly] = useState('')
  const [errors, setErrors] = useState('')
  const [view, setView] = useState('executed')
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationTime, setCompilationTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [optimizationLevel, setOptimizationLevel] = useState('O2')
  const [target, setTarget] = useState('x86_64')
  const fileInputRef = useRef()

  const handleEditorChange = (e) => {
    setCode(e.target.value)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file && (file.name.endsWith('.rs') || file.name.endsWith('.txt'))) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        setCode(evt.target.result)
      }
      reader.readAsText(file)
    } else {
      alert('Por favor sube un archivo .rs o .txt')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'main.rs'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleCompile = async () => {
    setIsCompiling(true)
    const startTime = Date.now()
    
    // Simular compilación
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const endTime = Date.now()
    setCompilationTime(endTime - startTime)
    
    // Lógica de compilación simulada
    if (code.includes('error') || code.includes('panic!')) {
      setErrors(`error[E0308]: mismatched types
 --> src/main.rs:5:13
  |
5 |     let x = "hello";
  |             ^^^^^^^ expected integer, found string

error: aborting due to previous error`)
      setOutput('')
      setAssembly('')
    } else {
      setErrors('')
      setOutput(`Compiling rust-project v0.1.0 (/path/to/project)
    Finished dev [unoptimized + debuginfo] target(s) in ${(compilationTime/1000).toFixed(2)}s
     Running \`target/debug/rust-project\`

¡Hola, mundo desde Rust!
Iteración 1: contador = 1
Iteración 2: contador = 3
Iteración 3: contador = 6
Iteración 4: contador = 10
Iteración 5: contador = 15
Factorial de 5 = 120`)
      
      setAssembly(`; Código ensamblador generado (${optimizationLevel}, ${target})
.section .text
.global _start

main:
    push   %rbp
    mov    %rsp,%rbp
    sub    $0x20,%rsp
    
    ; println! macro expansion
    lea    0x2004(%rip),%rdi
    mov    $0x1c,%esi
    call   puts@plt
    
    ; Loop setup
    movl   $0x0,-0x4(%rbp)
    movl   $0x1,-0x8(%rbp)
    
.L2:
    cmpl   $0x5,-0x8(%rbp)
    jg     .L3
    
    ; contador += i
    mov    -0x8(%rbp),%eax
    add    %eax,-0x4(%rbp)
    
    ; printf call
    mov    -0x8(%rbp),%edx
    mov    -0x4(%rbp),%esi
    lea    0x1fe0(%rip),%rdi
    call   printf@plt
    
    addl   $0x1,-0x8(%rbp)
    jmp    .L2
    
.L3:
    ; factorial(5) call
    mov    $0x5,%edi
    call   factorial
    
    mov    %eax,%esi
    lea    0x1fc0(%rip),%rdi
    call   printf@plt
    
    leave
    ret

factorial:
    push   %rbp
    mov    %rsp,%rbp
    sub    $0x10,%rsp
    mov    %edi,-0x4(%rbp)
    
    cmpl   $0x1,-0x4(%rbp)
    jg     .L5
    mov    $0x1,%eax
    jmp    .L6
    
.L5:
    mov    -0x4(%rbp),%eax
    sub    $0x1,%eax
    mov    %eax,%edi
    call   factorial
    
    imul   -0x4(%rbp),%eax
    
.L6:
    leave
    ret`)
    }
    
    setIsCompiling(false)
  }

  const getStatusIcon = () => {
    if (errors) return <AlertCircle className="text-red-400" size={20} />
    if (output) return <CheckCircle className="text-green-400" size={20} />
    return <Terminal className="text-gray-400" size={20} />
  }

  const getStatusText = () => {
    if (errors) return 'Error de compilación'
    if (output) return `Compilado exitosamente (${compilationTime}ms)`
    return 'Listo para compilar'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Code className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RustForge</h1>
              <p className="text-orange-300 text-sm">Compilador Online de Rust</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-gray-300">{getStatusText()}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Toolbar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload size={18} />
                <span>Subir .rs</span>
              </button>
              
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                onClick={handleDownload}
              >
                <Download size={18} />
                <span>Descargar</span>
              </button>
              
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={18} />
                <span>Config</span>
              </button>
            </div>
            
            <button
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all transform ${
                isCompiling 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg'
              } text-white`}
              onClick={handleCompile}
              disabled={isCompiling}
            >
              {isCompiling ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Compilando...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Compilar y Ejecutar</span>
                </>
              )}
            </button>
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nivel de Optimización
                  </label>
                  <select
                    value={optimizationLevel}
                    onChange={(e) => setOptimizationLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="O0">O0 - Sin optimización</option>
                    <option value="O1">O1 - Optimización básica</option>
                    <option value="O2">O2 - Optimización media</option>
                    <option value="O3">O3 - Optimización máxima</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Arquitectura Target
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="x86_64">x86_64 (64-bit)</option>
                    <option value="aarch64">ARM64</option>
                    <option value="wasm32">WebAssembly</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept=".rs,.txt"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleUpload}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600 flex items-center space-x-2">
              <FileText size={18} className="text-orange-400" />
              <span className="text-white font-medium">Editor de Código</span>
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">main.rs</span>
            </div>
            <div className="relative">
              <MonacoEditor
                language="rust"
                value={code}
                onChange={handleEditorChange}
                options={{
                  selectOnLineNumbers: true,
                  fontSize: 16,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                }}
                className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button
                onClick={() => copyToClipboard(code)}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                title="Copiar código"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {/* Output/Assembly Viewer */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal size={18} className="text-green-400" />
                    <span className="text-white font-medium">Salida del Compilador</span>
                  </div>
                  <div className="flex bg-gray-600 rounded-lg p-1">
                    <button
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        view === 'executed' 
                          ? 'bg-orange-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                      onClick={() => setView('executed')}
                    >
                      Ejecutado
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        view === 'assembly' 
                          ? 'bg-orange-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                      onClick={() => setView('assembly')}
                    >
                      Ensamblador
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="h-64 overflow-auto bg-gray-900 text-gray-100 font-mono text-xs p-4 whitespace-pre-wrap">
                  {view === 'executed' ? output : assembly}
                </pre>
                {(output || assembly) && (
                  <button
                    onClick={() => copyToClipboard(view === 'executed' ? output : assembly)}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                    title="Copiar salida"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Error Panel */}
            {errors && (
              <div className="bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-500/30 overflow-hidden">
                <div className="bg-red-800/30 px-4 py-3 border-b border-red-500/30 flex items-center space-x-2">
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-white font-medium">Errores de Compilación</span>
                </div>
                <div className="relative">
                  <pre className="h-32 overflow-auto bg-red-950/50 text-red-100 font-mono text-xs p-4 whitespace-pre-wrap">
                    {errors}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(errors)}
                    className="absolute top-2 right-2 p-2 bg-red-700 hover:bg-red-600 text-red-100 rounded transition-colors"
                    title="Copiar errores"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-center space-x-8 text-gray-300">
              <div className="text-center">
                <div className="text-orange-400 font-semibold">Desarrollado por:</div>
                <div className="mt-1">Eduardo Aragon • Mikel Bracamonte • Laura Nagamine</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              RustForge v1.0 - Compilador Online de Rust con soporte para múltiples arquitecturas
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App