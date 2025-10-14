'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

// 모달 컨텍스트 타입 정의
interface ModalContextType {
  isOpen: boolean
  content: ReactNode | null
  openModal: (content: ReactNode) => void
  closeModal: () => void
}

// 모달 컨텍스트 생성
const ModalContext = createContext<ModalContextType | undefined>(undefined)

// 모달 훅
export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal은 ModalProvider 안에서 사용되어야 합니다.')
  }
  return context
}

// 모달 컴포넌트
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      // 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 포털을 사용하여 body에 모달 렌더링
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

// 모달 프로바이더 컴포넌트
interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode | null>(null)

  const openModal = useCallback((content: ReactNode) => {
    setContent(content)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    // 애니메이션 완료 후 content 초기화
    setTimeout(() => {
      setContent(null)
    }, 300)
  }, [])

  const value: ModalContextType = {
    isOpen,
    content,
    openModal,
    closeModal
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {content}
      </Modal>
    </ModalContext.Provider>
  )
}
