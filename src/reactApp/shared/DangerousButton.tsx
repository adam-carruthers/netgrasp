import React, { useEffect, useState } from "react";

const DangerousButton: React.FC<{
  beforeInitialClickMessage: string;
  afterInitialClickMessage?: string;
  onSecondClick: () => any;
  className?: string;
  style?: Record<string, any>;
}> = ({
  beforeInitialClickMessage,
  afterInitialClickMessage = "Are you sure?",
  onSecondClick,
  className,
  style,
}) => {
  const [hasInitialClicked, setHasInitialClicked] = useState<boolean>(false);

  useEffect(() => {
    if (!hasInitialClicked) return undefined;

    const timeout = setTimeout(() => setHasInitialClicked(false), 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasInitialClicked]);

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        if (hasInitialClicked) {
          setHasInitialClicked(false);
          onSecondClick();
        } else {
          setHasInitialClicked(true);
        }
      }}
    >
      {hasInitialClicked ? afterInitialClickMessage : beforeInitialClickMessage}
    </button>
  );
};

export default DangerousButton;
