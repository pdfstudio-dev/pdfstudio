import { IFileSystem } from '../interfaces/IFileSystem'

/**
 * BrowserFileSystem - Browser implementation using fetch, FileReader, and Blob
 */
export class BrowserFileSystem implements IFileSystem {
  async readFile(source: string | File | Buffer): Promise<Buffer> {
    // If already a Buffer (Uint8Array in browser), return as-is
    if (Buffer.isBuffer(source)) {
      return source
    }

    // If File object (from <input type="file">)
    if (source instanceof File) {
      return this.readFileFromFileObject(source)
    }

    // If string URL, fetch it
    if (typeof source === 'string') {
      return this.readFileFromURL(source)
    }

    throw new Error('Invalid source type for readFile in browser')
  }

  private async readFileFromFileObject(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        resolve(Buffer.from(arrayBuffer))
      }

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${reader.error?.message}`))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  private async readFileFromURL(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      throw new Error(
        `Failed to fetch file from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async writeFile(filename: string, data: Buffer): Promise<void> {
    // In browser, trigger download
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'

    document.body.appendChild(a)
    a.click()

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  existsSync(path: string): boolean {
    // In browser, we can't check file existence synchronously
    // Always return false
    return false
  }

  isBrowser(): boolean {
    return true
  }
}
