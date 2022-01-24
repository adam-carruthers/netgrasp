import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectPinGroupsInOngoingEditOrder } from "../../redux/selectGraph/reselectView";
import { addBlankPinGroup } from "../../redux/slices/pinGroupsSlice";
import NotFound from "../shared/NotFound";
import PinGroup from "./PinGroup";

const PinGroupsTab = () => {
  const pinGroups = useAppSelector(selectPinGroupsInOngoingEditOrder);
  const dispatch = useAppDispatch();

  return (
    <div className="inner-tab">
      <div className="me-4" style={{ width: 200 }}>
        <b>Pin Groups</b>
        <br />
        If a node is in multiple active pin groups at the same time, it will
        take its pin position from the leftmost pin group.
      </div>
      <button
        type="button"
        className="btn btn-success me-3"
        style={{ width: 120 }}
        onClick={() => dispatch(addBlankPinGroup())}
      >
        Add new pin group
      </button>
      {pinGroups.length === 0 && (
        <div className="ms-2 h-100">
          <NotFound
            title="No pin groups yet!"
            subtitle="Click the button on the left to add one."
          />
        </div>
      )}
      {pinGroups.map((pinGroup) => (
        <PinGroup key={pinGroup.id} pinGroup={pinGroup} />
      ))}
    </div>
  );
};

export default PinGroupsTab;
