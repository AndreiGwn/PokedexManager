import React from 'react'

// Reusable button component with customizable children, onClick handler, and optional className
export default function MyButton({children, onClick, className=''}){
return (
<button className={"my-btn " + className} onClick={onClick}>
{children}
</button>
)
}