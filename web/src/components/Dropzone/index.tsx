import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
  setValue: Function;
}
// interface Props {
//   onFileUploaded: (file: File) => void;
// }

const Dropzone: React.FC<Props> = ({ onFileUploaded, setValue }) => {
  const [preview, SetPreview] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);

      SetPreview(fileUrl);
      onFileUploaded(file);
      setValue('file', file);
    },
    [onFileUploaded, setValue]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {preview ? (
        <img src={preview} alt="preview" />
      ) : (
        <span>
          <FiUpload />
          Selecione a imagem do estabelecimento
        </span>
      )}
    </div>
  );
};

export default Dropzone;
