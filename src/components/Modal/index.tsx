import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Modal, { PositionProp, ModalBodyProps } from './Modal'

type TooltipModalProps = {
  children: React.ReactNode
  modalBody?: React.ReactElement<ModalBodyProps, any>
  titlestyle?: React.CSSProperties
  style?: React.CSSProperties
  title?: string
  position?: PositionProp
  margin?: number
  width?: number
}

const TooltipModal = (props: TooltipModalProps) => {
  const blockRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const [isOpened, setIsOpened] = useState<boolean>(false)

  const blockRect: DOMRect | undefined =
    blockRef.current?.getBoundingClientRect()

  const open = () => {
    setIsOpened(true)
  }

  const close = () => {
    setIsOpened(false)
  }

  const rootElement = document.body

  const handleEvent = useCallback((event: any) => {
    const domElement = ReactDOM.findDOMNode(blockRef.current)
    let element = ReactDOM.findDOMNode(modalRef.current)
    let parentElement = element?.parentElement
    if (
      element &&
      domElement &&
      !element.contains(event.target) &&
      !domElement.contains(event.target)
    ) {
      if (parentElement && parentElement.hasChildNodes()) {
        let children = parentElement.childNodes
        for (let i = 0; i < children.length; i++) {
          if (children[i] === element) {
            break
          } else {
            if (children[i].contains(event.target)) {
              setIsOpened(false)
            }
          }
        }
      }
    }
  }, [])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpened(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpened) {
      return
    }

    rootElement?.addEventListener('mousedown', handleEvent)
    document.addEventListener('keydown', handleKeyPress)
    rootElement?.addEventListener('scroll', handleEvent, true)

    return () => {
      rootElement?.removeEventListener('mousedown', handleEvent)
      document.removeEventListener('keydown', handleKeyPress)
      rootElement?.removeEventListener('scroll', handleEvent, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened])

  return (
    <>
      <div
        ref={blockRef}
        style={{ cursor: 'pointer', display: 'inline' }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          isOpened ? close() : open()
        }}
      >
        {props.children}
      </div>
      {blockRect && (
        <Modal
          isOpened={isOpened}
          close={close}
          ref={modalRef}
          margin={props.margin}
          minHeight="144px"
          title={props.title}
          titlestyle={props.titlestyle}
          style={props.style}
          width={props.width}
          children={props.modalBody}
          position={props.position || 'auto'}
          rect={blockRect}
        />
      )}
    </>
  )
}

export default TooltipModal
