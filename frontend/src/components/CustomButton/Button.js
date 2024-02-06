import React from 'react'
import './Button.css'

const STYLES = [
    "bt--primary",
    "bt--outline",   
]

const SIZE = [
    "bt-md",
    "bt-large"
]

export const CustomButton = ({
    children, 
    type,
    onclick,
    buttonStyle,
    ButtonSize,
    LinkTo
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]
    const checkButtonSize = SIZE.includes(ButtonSize)? ButtonSize: SIZE[0]

    return (
        <button className={`bt ${checkButtonStyle} ${checkButtonSize}`} onClick={onclick} type={type}>{children}
        </button>
    )
}