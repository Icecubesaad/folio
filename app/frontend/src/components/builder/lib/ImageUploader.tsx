import React, { useState, useRef } from 'react'
import { Upload, Loader, X, Image as ImageIcon } from 'lucide-react'

export const ImageUploader = ({ images, onImagesChange, maxImages = 4 }) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    
    // Simulate file upload - In real app, upload to server
    const newImages = await Promise.all(
      files.slice(0, maxImages - images.length).map(async (file) => {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name
            })
          }
          reader.readAsDataURL(file)
        })
      })
    )

    onImagesChange([...images, ...newImages])
    setUploading(false)
  }

  const removeImage = (imageId) => {
    onImagesChange(images.filter(img => img.id !== imageId))
  }

  return (
	<div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Project Images ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          >
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploading ? 'Uploading...' : 'Add Images'}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Project image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Click to upload images
          </button>
        </div>
      )}
    </div>
  )
}