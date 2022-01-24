import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/reduxStore";
import { haltOngoingEdit } from "../../redux/slices/ongoingEditSlice";

const OngoingEditButton: React.FC<{
  isEditGoingSelector: (state: RootState) => boolean;
  notGoingMessage: string;
  goingMessage: string;
  onStartEditClick: () => any;
  className?: string;
  style?: Record<string, any>;
}> = ({
  isEditGoingSelector,
  notGoingMessage,
  goingMessage,
  onStartEditClick,
  className,
  style,
}) => {
  const isEditGoing = useAppSelector(isEditGoingSelector);
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      onClick={() =>
        isEditGoing ? dispatch(haltOngoingEdit()) : onStartEditClick()
      }
      className={className}
      style={style}
    >
      {isEditGoing ? goingMessage : notGoingMessage}
    </button>
  );
};

export default OngoingEditButton;
