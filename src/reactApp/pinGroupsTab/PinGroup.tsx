import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { startToggleNodesInPinGroup } from "../../redux/slices/ongoingEditSlice";
import {
  changePinGroupActivation,
  changePinGroupName,
  changePinGroupPosition,
  deletePinGroup,
  PinGroup as PinGroupType,
} from "../../redux/slices/pinGroupsSlice";
import DangerousButton from "../shared/DangerousButton";
import OngoingEditButton from "../shared/OngoingEditButton";

const PinGroup: React.FC<{ pinGroup: PinGroupType }> = ({ pinGroup }) => {
  const dispatch = useAppDispatch();
  const thisPinGroupIsBeingEdited = useAppSelector(
    ({ ongoingEdit }) =>
      ongoingEdit?.editType === "toggleNodesInPinGroup" &&
      ongoingEdit.pinGroupId === pinGroup.id
  );
  const pinGroupEditIsOngoing = useAppSelector(
    ({ ongoingEdit }) => ongoingEdit?.editType === "toggleNodesInPinGroup"
  );

  return (
    <>
      {thisPinGroupIsBeingEdited && (
        <div className="me-2">
          <b>Being edited:</b>
        </div>
      )}
      <div
        className={
          "bg-light-grey py-1 px-1" +
          (pinGroup.active ? " selected-tab-item" : "") +
          (thisPinGroupIsBeingEdited ? " me-5" : " me-2")
        }
        style={{ width: 250 }}
      >
        <input
          type="text"
          className="form-control py-0 mb-1"
          value={pinGroup.name}
          onChange={(event) =>
            dispatch(
              changePinGroupName({
                pinGroupId: pinGroup.id,
                newName: event.target.value,
              })
            )
          }
        />
        <button
          type="button"
          className="btn btn-primary w-100 py-0 mb-1"
          onClick={() =>
            dispatch(
              changePinGroupActivation({
                pinGroupId: pinGroup.id,
                newActivation: !pinGroup.active,
              })
            )
          }
          disabled={thisPinGroupIsBeingEdited}
        >
          {thisPinGroupIsBeingEdited
            ? "Unchangable during edit"
            : pinGroup.active
            ? "Deactivate"
            : "Activate"}
        </button>
        <DangerousButton
          beforeInitialClickMessage="Delete pin group"
          onSecondClick={() => dispatch(deletePinGroup(pinGroup.id))}
          className="btn btn-danger w-100 py-0 mb-1"
        />
        <OngoingEditButton
          isEditGoingSelector={() => thisPinGroupIsBeingEdited}
          notGoingMessage="Toggle nodes in group"
          goingMessage="Click here to cancel"
          className="btn btn-warning w-100 py-0 mb-1"
          onStartEditClick={() =>
            dispatch(startToggleNodesInPinGroup({ pinGroupId: pinGroup.id }))
          }
        />
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-info flex-grow-1 py-0 me-1"
            disabled={pinGroupEditIsOngoing}
            onClick={() =>
              dispatch(
                changePinGroupPosition({
                  pinGroupId: pinGroup.id,
                  positionIndexChange: -1,
                })
              )
            }
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            className="btn btn-info flex-grow-1 py-0"
            disabled={pinGroupEditIsOngoing}
            onClick={() =>
              dispatch(
                changePinGroupPosition({
                  pinGroupId: pinGroup.id,
                  positionIndexChange: 1,
                })
              )
            }
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default PinGroup;
