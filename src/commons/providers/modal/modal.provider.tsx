"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './styles.module.css'

// 모달 컨텍스트 타입 정의 (스택 기반)
interface ModalContextType {
  /** 하나라도 열려 있는지 여부 */
  isAnyOpen: boolean
  /** 현재 스택 크기 */
  stackSize: number
  /** 모달을 스택에 추가 */
  openModal: (content: ReactNode) => void
  /** 최상단 모달만 닫기 */
  closeTop: () => void
  /** 모든 모달 닫기 */
  closeAll: () => void
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

// 모달 프로바이더 컴포넌트 (스택 구현)
interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  // 스택: 후입선출로 렌더링
  const [modalStack, setModalStack] = useState<ReactNode[]>([])

  // ESC 키: 최상단만 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalStack(prev => (prev.length ? prev.slice(0, prev.length - 1) : prev))
      }
    }

    if (modalStack.length > 0) {
      document.addEventListener('keydown', handleEscapeKey)
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [modalStack.length])

  // 바디 스크롤 제어: 하나라도 열려 있으면 숨김
  useEffect(() => {
    const hasAnyOpen = modalStack.length > 0
    if (hasAnyOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      // 언마운트 안전장치
      document.body.style.overflow = 'unset'
    }
  }, [modalStack.length])

  const openModal = useCallback((content: ReactNode) => {
    setModalStack(prev => [...prev, content])
  }, [])

  const closeTop = useCallback(() => {
    setModalStack(prev => (prev.length ? prev.slice(0, prev.length - 1) : prev))
  }, [])

  const closeAll = useCallback(() => {
    setModalStack([])
  }, [])

  const value: ModalContextType = {
    isAnyOpen: modalStack.length > 0,
    stackSize: modalStack.length,
    openModal,
    closeTop,
    closeAll,
  }

  // 각 레이어(오버레이 + 컨테이너)를 포털로 렌더링하여 중첩 백드롭 지원
  const renderPortals = () => {
    if (modalStack.length === 0) return null
    const baseZ = 1000
    return modalStack.map((node, index) => {
      const zIndex = baseZ + index * 2
      return createPortal(
        (
          <div className={styles.overlay} style={{ zIndex }} key={index} onClick={closeTop} data-testid="modal-overlay">
            <div className={styles.container} style={{ zIndex: zIndex + 1 }} onClick={(e) => e.stopPropagation()}>
              {node}
            </div>
          </div>
        ),
        document.body
      )
    })
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      {renderPortals()}
    </ModalContext.Provider>
  )
}
