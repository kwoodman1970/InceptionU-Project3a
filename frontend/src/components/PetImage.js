import React from 'react';

const PetImage = (props) => {
  const {index, key, image, handleRemoveImage, handleImageOrderChange} = props;

  return (
    <div className='position-relative  p-3 rounded-3' key={index}>
      <img
        className='pet-img rounded-2'
        height='200px'
        src={image}
        key={index}
        alt={`Preview ${index}`}
      />
      <div className='pet-img-close position-absolute'>
        <button
          className='pet-img-close-button border-0'
          type='button'
          onClick={() => handleRemoveImage(index)}>
          <AiOutlineClose className='fs-6' />
        </button>
      </div>
      <div className='pet-img-back position-absolute'>
        {index !== 0 && (
          <button
            className='pet-img-back-button border-0'
            type='button'
            onClick={() => handleImageOrderChange(index, index - 1)}>
            <BiArrowBack className='fs-6' />
          </button>
        )}
      </div>
      <div className='pet-img-forward position-absolute'>
        {index !== previewImages.length - 1 && (
          <button
            className='pet-img-forward-button border-0'
            type='button'
            onClick={() => handleImageOrderChange(index, index + 1)}>
            <MdOutlineArrowForward className='fs-6' />
          </button>
        )}
      </div>
    </div>
  )}