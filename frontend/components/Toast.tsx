'use client'

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type ToastHandle = (msg: string) => void

const Toast = forwardRef<ToastHandle>(function Toast(_, ref){
  const [text, setText] = useState('')
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => (msg: string)=>{
    setText(msg); setShow(true); setTimeout(()=>setShow(false), 1800)
  })

  return (
    <div id="toast" className={`toast ${show ? 'show' : ''}`} role="status" aria-live="polite">{text}</div>
  )
})

export default Toast
