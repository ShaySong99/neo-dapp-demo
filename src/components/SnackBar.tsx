import * as React from "react";
import { Transition } from "react-transition-group";
import { useTheme } from "@mui/system";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar as BaseSnackbar } from "@mui/base/Snackbar";
import { type SnackbarCloseReason } from "@mui/base/useSnackbar";

function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === "dark";
}

export default function Snackbar({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: (_: any, reason?: SnackbarCloseReason) => void;
  children: React.ReactNode;
}) {
  const isDarkMode = useIsDarkMode();

  const [exited, setExited] = React.useState(true);
  const nodeRef = React.useRef(null);

  const handleOnEnter = () => {
    setExited(false);
  };

  const handleOnExited = () => {
    setExited(true);
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <BaseSnackbar
        autoHideDuration={5000}
        open={open}
        onClose={onClose}
        exited={exited}
        className="min-w-xs fixed bottom-4 left-auto right-4 z-50 flex max-w-xl	font-sans"
      >
        <Transition
          timeout={{ enter: 400, exit: 400 }}
          in={open}
          appear
          unmountOnExit
          onEnter={handleOnEnter}
          onExited={handleOnExited}
          nodeRef={nodeRef}
        >
          {(status) => (
            <div
              className="flex gap-4	overflow-hidden	rounded-lg border border-solid	border-slate-200 bg-white p-3 text-start text-slate-900 shadow-md dark:border-slate-700 dark:bg-slate-900	dark:text-slate-50"
              style={{
                transform: positioningStyles[status],
                transition: "transform 300ms ease",
              }}
              ref={nodeRef}
            >
              <CheckRoundedIcon
                sx={{
                  color: "success.main",
                  flexShrink: 0,
                  width: "1.25rem",
                  height: "1.5rem",
                }}
              />
              <PriorityHighRoundedIcon
                sx={{
                  color: "error.main",
                  flexShrink: 0,
                  width: "1.25rem",
                  height: "1.5rem",
                }}
              ></PriorityHighRoundedIcon>
              <div className="max-w-full	flex-1">
                {children}
                {/* <p className="m-0 mr-2 font-medium leading-normal">
                  Notifications sent
                </p>
                <p className="m-0 font-normal leading-normal	text-slate-800 dark:text-slate-400">
                  Everything was sent to the desired address.
                </p> */}
              </div>
              <CloseIcon
                onClick={onClose}
                className="shrink-0	cursor-pointer	rounded	p-0.5 hover:bg-slate-50 hover:dark:bg-slate-800"
              />
            </div>
          )}
        </Transition>
      </BaseSnackbar>
    </div>
  );
}

const positioningStyles = {
  entering: "translateX(0)",
  entered: "translateX(0)",
  exiting: "translateX(500px)",
  exited: "translateX(500px)",
  unmounted: "translateX(500px)",
};
