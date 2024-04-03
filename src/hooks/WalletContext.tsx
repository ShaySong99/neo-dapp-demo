import { type WalletName } from "@/utils/walletApi/config";
import {
  type ReactNode,
  type Dispatch,
  type Reducer,
  createContext,
  useReducer,
} from "react";

type WalletState = {
  connected:
    | {
        walletName: WalletName;
        address: string;
        network: string;
      }
    | undefined;
};

const initialState: WalletState = {
  connected: undefined,
};

export const WalletContext = createContext<
  [
    WalletState,
    Dispatch<{
      type: string;
      payload: any;
    }>,
  ]
>([
  initialState,
  () => {
    //
  },
]);

const reducer: Reducer<
  WalletState,
  {
    type: string;
    payload: any;
  }
> = (state, action) => {
  switch (action.type) {
    case "connected":
      return {
        ...state,
        connected: action.payload,
      };

    default:
      return state;
  }
};

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <WalletContext.Provider value={[state, dispatch]}>
      {children}
    </WalletContext.Provider>
  );
};
