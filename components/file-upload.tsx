'use client'

import { useState } from 'react'
import { Upload, X, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  accept?: string
}

export function FileUpload({ onFilesSelected, maxFiles = 5, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png' }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles]
    const limited = combined.slice(0, maxFiles)
    setFiles(limited)
    onFilesSelected(limited)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected(updated)
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Drag and drop files here or{' '}
            <span className="text-blue-600 hover:text-blue-700">click to select</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max {maxFiles} files)
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
