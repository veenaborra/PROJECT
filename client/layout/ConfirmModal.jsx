import React from 'react'

const ConfirmModal=({message,onConfirm,onCancel})=>{
return (
    <div className='fixed inset-0  flex justify-center items-center z-50'>
   <div className='bg-white rounded-xl p-6 w-full max-w-sm shadow-lg'>
   <p className='text-lg mb-4 text-gray-800'>
{message}
   </p>
   <div className='flex justify-end space-x-3'>
<button onClick={onCancel} className='px-4 py-2 bg-gray-500 hover:bg-gray-300 rounded-md'>
Cancel
</button>
<button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white hover:bg-gray-700 rounded-md'>
Delete
</button>
   </div>
   </div>
    </div>
)
}
export default ConfirmModal;