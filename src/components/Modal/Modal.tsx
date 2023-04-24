import React, { ForwardedRef, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import closeBtn from '../../asset/resourse/close.png';

import './styles.css'


export type PositionProp =
  | 'auto'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topRight'
  | 'topLeft'
  | 'topFull'
  | 'bottomFull'
export interface ModalBodyProps {
  close?: () => void
}

function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

type ModalProps = {
  minHeight?: string | number
  height?: number
  title?: string
  titlestyle?: React.CSSProperties
  style?: React.CSSProperties
  children?: React.ReactElement<ModalBodyProps, any>
  position: PositionProp
  margin?: number
  rect: DOMRect
  width?: number
  isOpened?: boolean
  close: () => void
}

type Position = {
  top: number
  left: number
  right?: number
}

const Modal = React.forwardRef(
  (props: ModalProps, ref: ForwardedRef<HTMLDivElement | null>) => {
    const [position, setPosition] = useState<Position | null>(null)
    const mainRef = useRef<HTMLDivElement | null>(null)

    const rootElement = document.body

    // Модальное окно снизу слева от блока и прижато к правой стороне
    const getPositionBottomRight = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.bottom + margin,
      left: props.rect.right - width,
    })

    // Модальное окно сверху слева от блока и прижато к правой стороне
    const getPositionTopRight = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.top - height - margin,
      left: props.rect.right - width,
    })

    // Модальное окно снизу справа от блока и прижато к левой стороне
    const getPositionBottomLeft = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.bottom + margin,
      left: props.rect.left,
    })

    // Модальное окно сверху справа от блока и прижато к левой стороне
    const getPositionTopLeft = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.top - height - margin,
      left: props.rect.left,
    })

    const getPositionTopFull = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.top - height - margin,
      left: margin,
      right: margin,
    })

    const getPositionBottomFull = (
      margin: number,
      width: number,
      height: number,
    ): Position => ({
      top: props.rect.bottom + margin,
      left: margin,
      right: margin,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getPosition = (rect: DOMRect, position?: PositionProp): Position => {
      const margin: number = props.margin || 10

      let newPosition: Position | undefined = undefined

      if (position === 'bottomLeft') {
        newPosition = getPositionBottomLeft(margin, rect.width, rect.height)
      }
      if (position === 'bottomRight') {
        newPosition = getPositionBottomRight(margin, rect.width, rect.height)
      }
      if (position === 'topLeft') {
        newPosition = getPositionTopLeft(margin, rect.width, rect.height)
      }
      if (position === 'topRight') {
        newPosition = getPositionTopRight(margin, rect.width, rect.height)
      }

      if (position === 'topFull') {
        newPosition = getPositionTopFull(margin, rect.width, rect.height)
      }

      if (position === 'bottomFull') {
        newPosition = getPositionBottomFull(margin, rect.width, rect.height)
      }

      if (newPosition) return newPosition

      let vertical: 'top' | 'bottom' = 'bottom'
      let horizontal: 'Left' | 'Right' | 'Full' = 'Left'

      if (
        props.rect.left + margin * 2 + rect.width >
        document.body.clientWidth
      ) {
        if (props.rect.right - margin * 2 - rect.width < 0) {
          horizontal = 'Full'
        } else {
          horizontal = 'Right'
        }
      }

      if (
        props.rect.bottom + margin * 2 + rect.height >
        document.body.clientHeight
      ) {
        vertical = 'top'
      }

      return getPosition(rect, `${vertical}${horizontal}`)
    }

    const close = () => {
      props.close()
    }

    useEffect(() => {
      if (mainRef?.current) {
        let newPosition: Position = getPosition(
          mainRef.current.getBoundingClientRect(),
          props.position,
        )
        if (
          newPosition.left !== position?.left ||
          newPosition.top !== position?.top
        ) {
          setPosition(newPosition)
        }
      }
    }, [
      getPosition,
      mainRef,
      props.rect,
      props.position,
      position?.left,
      position?.top,
    ])

    if (!props.isOpened) {
      return <></>
    }

    let children = props.children
    let child = children
    if (React.isValidElement(children)) {
      child = React.cloneElement(children, { close })
    }

    return (
      <>
        {ReactDOM.createPortal(
          <div
            onClick={(e) => {
              // e.preventDefault()
              e.stopPropagation()
            }}
            ref={mergeRefs([ref, mainRef])}
            className="custom-modal-main"
            style={
              position
                ? {
                    top: position.top,
                    left: position.left,
                    right: position.right,
                    zIndex: 2,
                    width: props.width ? props.width : '',
                    maxWidth:
                      position.right === undefined
                        ? ''
                        : `calc(100% - ${position.left + position.right}px)`,
                    opacity: 1,
                    ...props.style,
                  }
                : { top: 0, left: 0, zIndex: -1, opacity: 0 }
            }
          >
            {props.title && (
              <div className="custom-modal-header" style={props.titlestyle}>
                <h6>{props.title}</h6>
                <button className="custom-modal-header__bth" onClick={close}>
                    <img src={closeBtn} alt="Close modal"/>
                </button>
              </div>
            )}
            <div className="custom-modal-body">{child}</div>
          </div>,
          rootElement,
        )}
      </>
    )
  },
)

export default Modal
