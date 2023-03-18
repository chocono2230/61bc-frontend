import React, { useState, useCallback, createContext, ReactNode } from 'react';
import { Base64Image } from '../api/types/image';

const initialState = new Map<string, Base64Image>();

type Base64ContextType = Map<string, Base64Image>;
export const Base64ImageContext = createContext<Base64ContextType | null>(null);
export const Base64ImageDispatchContext = createContext<((id: string, data: Base64Image) => void) | null>(null);
type Props = {
  children: ReactNode;
};

const ImageProvider = (props: Props) => {
  const { children } = props;
  const [base64Image, setBase64Image] = useState<Map<string, Base64Image>>(initialState);

  const addData = useCallback((id: string, data: Base64Image) => {
    setBase64Image((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, data);
      return newMap;
    });
  }, []);

  return (
    <Base64ImageContext.Provider value={base64Image}>
      <Base64ImageDispatchContext.Provider value={addData}>{children}</Base64ImageDispatchContext.Provider>
    </Base64ImageContext.Provider>
  );
};

export default ImageProvider;
